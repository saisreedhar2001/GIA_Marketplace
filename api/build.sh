#!/bin/bash
pip install --upgrade pip setuptools wheel
pip install --only-binary :all: cryptography pydantic-core
pip install -r requirements.txt