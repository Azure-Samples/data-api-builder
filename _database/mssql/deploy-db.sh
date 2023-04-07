#!/bin/bash
set -eo pipefail

# Load values from .env file 
FILE=".env"
if [[ -f $FILE ]]; then
    echo "Loading $FILE" 
    eval $(egrep "^[^#;]" $FILE | tr '\n' '\0' | xargs -0 -n1 | sed 's/^/export /')
else
    echo "Cannot find '$FILE' file."
    echo "Please create one as mentioned in the README."    
    exit 1
fi

if [[ ! -v MSSQL_DEPLOY ]]; then
    echo "Cannot find MSSQL enviroment variable."
    echo "Please create an '$FILE' as described in the README."      
    exit
fi

echo "Building .dacpac ..."
dotnet build ./LibraryDB -c Release         

echo "Deploying .dacpac ..."
sqlpackage /a:Publish -sf:./LibraryDB/bin/Release/LibraryDB.dacpac -tcs:"$MSSQL_DEPLOY" /p:DropObjectsNotInSource=false

echo "Done."
