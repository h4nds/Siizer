#!/bin/bash

# Git Publisher - Universal Publishing Script
# A beautiful, easy-to-use script for publishing any project to Git platforms
# Author: Ray Wretch
# Version: 1.1.0

set -euo pipefail  # More strict error handling

# Colors for beautiful output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Get project name from current directory
PROJECT_NAME=$(basename "$(pwd)")

# Function to check if there are uncommitted changes
has_uncommitted_changes() {
    # Check if repository has any commits
    if ! git rev-parse --verify HEAD > /dev/null 2>&1; then
        # No commits yet, check if there are any files to commit
        if [ -n "$(git ls-files --others --exclude-standard)" ] || [ -n "$(git diff --cached)" ]; then
            return 0  # Has changes
        fi
        return 1  # No changes
    fi
    
    # Check for uncommitted changes (staged or unstaged)
    if ! git diff-index --quiet HEAD -- 2>/dev/null || [ -n "$(git ls-files --others --exclude-standard)" ]; then
        return 0  # Has changes
    fi
    return 1  # No changes
}

# Function to get current branch name
get_current_branch() {
    git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main"
}

# Function to commit changes (with option to skip)
commit_changes() {
    local commit_message="$1"
    local skip_commit="${2:-false}"
    
    if [ "$skip_commit" = "true" ]; then
        print_info "Skipping commit (as requested)"
        return 0
    fi
    
    if ! has_uncommitted_changes; then
        print_info "No uncommitted changes to commit"
        return 0
    fi
    
    print_status "Staging all changes..."
    git add .
    
    # Check if there are actually staged changes
    if [ -z "$(git diff --cached)" ] && [ -z "$(git ls-files --others --exclude-standard)" ]; then
        print_info "No changes to commit"
        return 0
    fi
    
    print_status "Committing changes..."
    if git commit -m "$commit_message"; then
        print_success "Changes committed!"
        return 0
    else
        print_error "Commit failed"
        return 1
    fi
}

# Function to push to remote
push_to_remote() {
    local branch_name="$1"
    local set_upstream="${2:-false}"
    
    if [ "$set_upstream" = "true" ]; then
        if git push -u origin "$branch_name"; then
            return 0
        fi
    else
        if git push origin "$branch_name"; then
            return 0
        fi
    fi
    return 1
}

print_header "🚀 Git Publisher - Universal Publishing Script"
echo "=================================================="
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    print_error "Git is required but not installed."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository."
    print_info "Initializing git repository..."
    git init
    print_success "Git repository initialized!"
fi

# Get current branch name
CURRENT_BRANCH=$(get_current_branch)

print_status "Current repository status:"
git status --short
echo ""

# Check if remote already exists
if git remote get-url origin > /dev/null 2>&1; then
    print_info "Remote 'origin' already exists:"
    git remote get-url origin
    echo ""
    print_status "Available actions:"
    echo "1. Push changes to existing remote"
    echo "2. Set up new remote (will replace existing)"
    echo "3. Change remote URL"
    echo ""
    read -p "Choose action (1-3): " action_choice
    
    case $action_choice in
        1)
            echo ""
            print_status "Pushing changes to existing remote..."
            print_info "You may be prompted for credentials."
            echo ""
            
            # Ask if user wants to commit changes
            if has_uncommitted_changes; then
                read -p "Commit uncommitted changes before pushing? (Y/n): " commit_choice
                commit_choice=${commit_choice:-Y}
                if [[ $commit_choice =~ ^[Yy]$ ]]; then
                    commit_changes "Update $PROJECT_NAME - $(date '+%Y-%m-%d %H:%M')"
                fi
            fi
            
            if push_to_remote "$CURRENT_BRANCH"; then
                echo ""
                print_success "Changes pushed to remote!"
                print_info "Repository: $(git remote get-url origin)"
            else
                echo ""
                print_error "Push failed. Please check:"
                echo "1. Repository exists and you have write access"
                echo "2. Your credentials are correct"
                echo "3. No conflicts with remote changes"
                echo "4. Branch name is correct (current: $CURRENT_BRANCH)"
                echo ""
                print_info "Try manually: git push origin $CURRENT_BRANCH"
            fi
            exit 0
            ;;
        2)
            echo ""
            print_warning "This will replace the existing remote."
            read -p "Continue? (y/N): " confirm
            if [[ ! $confirm =~ ^[Yy]$ ]]; then
                print_error "Cancelled."
                exit 1
            fi
            git remote remove origin
            ;;
        3)
            echo ""
            read -p "Enter new remote URL: " new_url
            if [ -z "$new_url" ]; then
                print_error "URL cannot be empty"
                exit 1
            fi
            git remote set-url origin "$new_url"
            print_success "Remote URL updated to: $new_url"
            echo ""
            print_status "Pushing changes..."
            if push_to_remote "$CURRENT_BRANCH"; then
                print_success "Changes pushed!"
            else
                print_error "Push failed. Try: git push origin $CURRENT_BRANCH"
            fi
            exit 0
            ;;
        *)
            print_error "Invalid choice. Exiting."
            exit 1
            ;;
    esac
fi

print_status "Publishing Options:"
echo "1. GitHub (recommended)"
echo "2. GitLab"
echo "3. Bitbucket"
echo "4. Codeberg"
echo "5. Custom remote"
echo "6. Quick push (if remote already configured)"
echo ""

read -p "Choose an option (1-6): " choice

case $choice in
    1)
        echo ""
        print_status "GitHub Setup Instructions:"
        echo "1. Go to https://github.com/new"
        echo "2. Repository name: $PROJECT_NAME"
        echo "3. Description: (enter your project description)"
        echo "4. Make it Public or Private"
        echo "5. Don't initialize with README (we'll push our own)"
        echo "6. Click 'Create repository'"
        echo ""
        read -p "Enter your GitHub username: " github_user
        if [ -z "$github_user" ]; then
            print_error "Username cannot be empty"
            exit 1
        fi
        read -p "Enter repository name (default: $PROJECT_NAME): " repo_name
        repo_name=${repo_name:-$PROJECT_NAME}
        
        echo ""
        print_status "Adding GitHub remote..."
        git remote add origin "https://github.com/$github_user/$repo_name.git"
        # Only rename branch if it's not already main/master
        if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
            git branch -M main
            CURRENT_BRANCH="main"
        fi
        print_success "GitHub remote added!"
        ;;
        
    2)
        echo ""
        read -p "Enter your GitLab username: " gitlab_user
        if [ -z "$gitlab_user" ]; then
            print_error "Username cannot be empty"
            exit 1
        fi
        read -p "Enter repository name (default: $PROJECT_NAME): " repo_name
        repo_name=${repo_name:-$PROJECT_NAME}
        
        echo ""
        print_status "Adding GitLab remote..."
        git remote add origin "https://gitlab.com/$gitlab_user/$repo_name.git"
        if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
            git branch -M main
            CURRENT_BRANCH="main"
        fi
        print_success "GitLab remote added!"
        ;;
        
    3)
        echo ""
        read -p "Enter your Bitbucket username: " bitbucket_user
        if [ -z "$bitbucket_user" ]; then
            print_error "Username cannot be empty"
            exit 1
        fi
        read -p "Enter repository name (default: $PROJECT_NAME): " repo_name
        repo_name=${repo_name:-$PROJECT_NAME}
        
        echo ""
        print_status "Adding Bitbucket remote..."
        git remote add origin "https://bitbucket.org/$bitbucket_user/$repo_name.git"
        if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
            git branch -M main
            CURRENT_BRANCH="main"
        fi
        print_success "Bitbucket remote added!"
        ;;
        
    4)
        echo ""
        read -p "Enter your Codeberg username: " codeberg_user
        if [ -z "$codeberg_user" ]; then
            print_error "Username cannot be empty"
            exit 1
        fi
        read -p "Enter repository name (default: $PROJECT_NAME): " repo_name
        repo_name=${repo_name:-$PROJECT_NAME}
        
        echo ""
        print_status "Adding Codeberg remote..."
        git remote add origin "https://codeberg.org/$codeberg_user/$repo_name.git"
        if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
            git branch -M main
            CURRENT_BRANCH="main"
        fi
        print_success "Codeberg remote added!"
        ;;
        
    5)
        echo ""
        read -p "Enter custom remote URL: " custom_url
        if [ -z "$custom_url" ]; then
            print_error "URL cannot be empty"
            exit 1
        fi
        
        echo ""
        print_status "Adding custom remote..."
        git remote add origin "$custom_url"
        if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
            git branch -M main
            CURRENT_BRANCH="main"
        fi
        print_success "Custom remote added!"
        ;;
        
    6)
        echo ""
        print_status "Quick push to existing remote..."
        
        # Check if remote exists
        if ! git remote get-url origin > /dev/null 2>&1; then
            print_error "No remote 'origin' configured."
            print_info "Please set up a remote first using options 1-5."
            exit 1
        fi
        
        print_info "Remote: $(git remote get-url origin)"
        echo ""
        
        # Ask if user wants to commit changes
        if has_uncommitted_changes; then
            read -p "Commit uncommitted changes before pushing? (Y/n): " commit_choice
            commit_choice=${commit_choice:-Y}
            if [[ $commit_choice =~ ^[Yy]$ ]]; then
                commit_changes "Update $PROJECT_NAME - $(date '+%Y-%m-%d %H:%M')"
            fi
        fi
        
        if push_to_remote "$CURRENT_BRANCH"; then
            echo ""
            print_success "Changes pushed to remote!"
            print_info "Repository: $(git remote get-url origin)"
        else
            echo ""
            print_error "Push failed. Please check:"
            echo "1. Repository exists and you have write access"
            echo "2. Your credentials are correct"
            echo "3. No conflicts with remote changes"
            echo "4. Branch name is correct (current: $CURRENT_BRANCH)"
            echo ""
            print_info "Try manually: git push origin $CURRENT_BRANCH"
        fi
        exit 0
        ;;
        
    *)
        print_error "Invalid option. Exiting."
        exit 1
        ;;
esac

echo ""
print_status "Pushing to remote repository..."
print_info "You may be prompted for credentials."
echo ""

# Ask if user wants to commit before pushing
if has_uncommitted_changes; then
    read -p "Commit uncommitted changes before pushing? (Y/n): " commit_choice
    commit_choice=${commit_choice:-Y}
    if [[ $commit_choice =~ ^[Yy]$ ]]; then
        commit_changes "Initial commit: $PROJECT_NAME"
    fi
else
    # Check if repository is empty (no commits)
    if ! git rev-parse --verify HEAD > /dev/null 2>&1; then
        print_warning "Repository has no commits yet."
        read -p "Create initial commit? (Y/n): " initial_commit
        initial_commit=${initial_commit:-Y}
        if [[ $initial_commit =~ ^[Yy]$ ]]; then
            commit_changes "Initial commit: $PROJECT_NAME"
        fi
    fi
fi

# Push to remote
if push_to_remote "$CURRENT_BRANCH" true; then
    echo ""
    print_success "Success! $PROJECT_NAME has been published!"
    echo ""
    print_status "Next steps:"
    echo "1. Visit your repository URL to verify"
    echo "2. Add a description and topics"
    echo "3. Share with the community!"
    echo ""
    print_info "Repository URL:"
    git remote get-url origin
    echo ""
    print_info "Installation instructions for others:"
    echo "git clone $(git remote get-url origin)"
    echo "cd $PROJECT_NAME"
    echo ""
else
    echo ""
    print_error "Push failed. Please check:"
    echo "1. Repository exists on the platform"
    echo "2. You have write permissions"
    echo "3. Your credentials are correct"
    echo "4. Branch name is correct (current: $CURRENT_BRANCH)"
    echo ""
    print_info "You can try manually:"
    echo "git push -u origin $CURRENT_BRANCH"
fi

echo ""
print_header "🎉 Happy coding!"
