#!/bin/bash
pip install --upgrade pip setuptools wheel
pip install --only-binary :all: cryptography
pip install -r requirements.txt