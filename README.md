# Agent Smith user interface

A web interface for [Agent Smith](https://github.com/synw/agent-smith)

## Install

Clone and install the dependencies:

```bash
git clone -b devpreview2 ssh://git@hiroux.fr:6/j3/agent-smith-ui.git
```bash
git clone -b devpreview2 ssh://git@hiroux.fr:6/j3/agent-smith-ui.git
cd agent-smith-ui
# install dependencies
# install dependencies
npm i
# build
npm run build
```

Run the ui to configure everything for a fresh install:

```bash
npm run local
# build
npm run build
```

Run the ui to configure everything for a fresh install:

```bash
npm run local
```

## Install the Python dependencies for the search agents

Create a virtual env and activate it:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the packages:

Create a virtual env and activate it:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the packages:

```bash
pip install duckduckgo_search smolagents crawl4ai
```

Important: activate your Python virtual env before starting the app

## Install the debate app

Clone and install the dependencies:

```
git clone ssh://git@hiroux.fr:6/j3/agent-smith-apps.git
cd agent-smith-apps/debate
# install dependencies
npm i
# build
npm run build
```

IMPORTANT: clone it in the same folder as ssh://git@hiroux.fr:6/j3/agent-smith-ui.git
IMPORTANT: clone it in the same folder as ssh://git@hiroux.fr:6/j3/agent-smith-ui.git

Install:

```bash
cd agent-smith-ui
cd agent-smith-ui
node scripts/installapp.js debate
```

## Start

Run your Llama.cpp

```
npm run local
```

Go to http://localhost:5184

