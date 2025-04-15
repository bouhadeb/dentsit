Set WshShell = CreateObject("WScript.Shell")
strPath = WScript.ScriptFullName
strPath = Left(strPath, InStrRev(strPath, "\"))
WshShell.CurrentDirectory = strPath

' Run the batch file
WshShell.Run "start_dental_app.bat", 0, False 