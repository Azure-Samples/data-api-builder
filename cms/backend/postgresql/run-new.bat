@echo off


CALL init-db && CALL run-server || echo Failed to initialize db, safely exiting.
