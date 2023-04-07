$envFile = ".env"

# Load values from .env file 
if (Test-Path $envFile) {
  Write-Host "Loading '$envFile' ..."
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#].+?)\s*=\s*(.+?)\s*$') {
      $varName = $matches[1]
      $varValue = $matches[2] -replace '"'            
      $varValue = $varValue -replace "'"            
      Set-Item -Path "Env:$varName" -Value "$varValue"
    }
  }
} else {
  Write-Host "Cannot find '$envFile' file."
  Write-Host "Please create one as mentioned in the README."    
  exit
}

# Check that MSSQL variable is set
if (!(Test-Path env:MSSQL_DEPLOY)) {
  Write-Host "Cannot find MSSQL_DEPLOY enviroment variable."
  Write-Host "Please create an '$envFile' as described in the README."      
  exit
}

Write-Host "Building .dacpac ..."
dotnet build ".\LibraryDB\" -c Release         

Write-Host "Deploying .dacpac ..."
sqlpackage -a:Publish -sf:.\LibraryDB\bin\Release\LibraryDB.dacpac -tcs:$env:MSSQL_DEPLOY /p:DropObjectsNotInSource=false

Write-Host "Done."
