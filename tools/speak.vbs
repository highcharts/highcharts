' Windows alternative for macOS build-in say command
Dim Speak
Set Speak=CreateObject("sapi.spvoice")
ReDim Text(WScript.Arguments.Count-1)
For i = 0 To WScript.Arguments.Count-1
    Text(i) = WScript.Arguments(i)
Next
Speak.Speak Join(Text, " ")
