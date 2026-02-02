#!/bin/bash
pip install --upgrade pip setuptools wheel
pip install --only-binary :all: --no-build-isolation -r requirements.txt