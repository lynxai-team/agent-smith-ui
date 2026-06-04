# Agent Smith user interface

A web interface for [Agent Smith](https://github.com/lynxai-team/agent-smith)

## Install

Clone and install the dependencies:

```bash
mkdir agent-smith-env
cd agent-smith-env
git clone https://github.com/lynxai-team/agent-smith-ui.git
cd agent-smith-ui
# install dependencies
npm i
# build
npm run build
```

## Install the Python dependencies for the search agents

Create a virtual env and activate it:

```bash
python3 -m .venv venv
source .venv/bin/activate
```

Install the packages:

```bash
pip install duckduckgo_search smolagents crawl4ai
```

Important: activate your Python virtual env before starting the app

## Install the debate app

Clone and install the dependencies:

```bash
git clone https://github.com/lynxai-team/agent-smith-apps.git
cd agent-smith-apps/debate
# install dependencies
npm i
# build
npm run build
```

IMPORTANT: clone it in the same folder as the ui repository

Install:

```bash
cd agent-smith-ui
node scripts/installapp.js debate
```

## Start

Run your Llama.cpp

```
npm run local
```

Run the ui to configure everything for a fresh install:

```bash
# run
npm run local
```

Go to http://localhost:5184

