' Windows alternative for macOS build-in say command
Dim Speak
Set Speak=CreateObject("sapi.spvoice")
Speak.Speak "%*"
