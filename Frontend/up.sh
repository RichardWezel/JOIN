#!/bin/sh
#
# Commits all changes, pushes them to GitHub and deploys the Frontend
# to the All-Inkl webspace via git-ftp.
#
# Usage: ./up.sh "commit message"

set -e

if [ -z "$*" ]; then
	echo 'Usage: ./up.sh "commit message"' >&2
	exit 1
fi

# git-ftp checks syncroot and .git-ftp-ignore relative to the current
# directory, so everything has to run from the repository root.
cd "$(git rev-parse --show-toplevel)"

git pull
git add -A

if git diff --cached --quiet; then
	echo "Nothing to commit, deploying current state."
else
	git commit -m "$*"
fi

git push

# Uploads only files below Frontend/ (git-ftp.syncroot) and only what
# changed since the last deployment.
git ftp push
