Get-Content .env | ForEach-Object {
    if ($_ -match '^[^#].*=.*$') {
        $pair = $_ -split '=', 2
        $name = $pair[0].Trim()
        $value = $pair[1].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}
# si erreur de securite sur lexecution du script faire ceci :
# Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
