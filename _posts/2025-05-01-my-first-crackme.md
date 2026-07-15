---
layout: post
title: "My First CrackMe"
date: 2025-05-01 13:27:12
category: re
---
After earning my GREM and PMRP, I thought of looking for a job that has Reverse Engineering or Malware Research. It's been like 15days already and I received a 1 unfortunately and a lot of no response on all my application. So I thought to myself that, certification is certainly not enough to show how passionate or how much I wanted to be in Reverse Engineering field so I decided to learn Game Hacking from GuidedHacking (again! had to stop since I enrolled on a lot of courses last year and early this year) and also start with Crackmes.

My first crackme was "Simple crackme by ionchad". You can try it or download it [here](https://crackmes.one/crackme/67fd376f8f555589f3530b9d).

Solution:

After downloading and unzipping the file, it contains an exe file named "WinUtilsHelper.exe"

![Executable File](/images/winutil-1.png)

If you run the executable, it will prompt you to enter a license key. Inputting an incorrect value will pop a message that says invalid license.

![MessageBox](/images/winutil-2.png)

With that information, I thought of the Windows' API that is used to display an error message and that is the Windows' MessageBox.

I open Ghidra and created a new project for this executable. On Ghidra, I go to "Windows > Symbol References" and Search for "Message".

![Ghidra Symbol Reference](/images/winutil-3.png)

There will be 3 Location from where the MessageBoxA is referenced. I clicked on the memory address 140001031. Clicking on that Memory Address automatically update the listing view in Ghidra so that you are on that specific Memory Address.

![Memory Address](/images/winutil-4.png)

Here we can see that the first Call to MessageBoxA was used to display the message "Debugger Detected" so we know that this executable has its own defense mechanism to prevent it from being debugged. 

Now, we go to the second memory location from where the MessageBoxA was referenced. The memory location is 1400017f2.

![Invalid License](/images/winutil-5.png)

As we can see on the Listing View in Ghidra, clicking on that memory location shows the string "Invalid License" which is the string we see upon inputting a string on the executable's enter license key prompt.

I'm no expert in Reverse Engineering so by getting to this specific part of the function I can't easily determine who calls who. So to try to understand it, I scroll up the listing view until I see the beginning of the function.

![Start of Function](/images/winutil-6.png)

I saw the banner FUNCTION so I now know that I'm at the beginning of the function. This function accepts the three parameters and a lot of local variables. Like I said, I'm no expert so my thinking is maybe one of this local variable holds or store information about the license key then this value on this variable is used to compare it to user input.

I checked what value is passed on that local variable by clicking on the memory location in the XREF field on the right side of the local variable.

![Local Variable](/images/winutil-7.png)

On local_e0 we can see that it was referenced 3 times. I clicked 1400016c0 to go to that memory address.

![local_e0](/images/winutil-8.png)

Here we can see the value that uses or references local_e0. One thing that stood out of the rest is the value 0x5a57494b. So technically, 0x5a57494b is placed on the stack and Ghidra placed the label local_e0 to easily determine on how many bytes it needed to add from RSP to go to that specific address in the stack.

![ZWIK](/images/winutil-9.png)

Now if we hover the mouse in that hex value we can see that the character is ZWIK and since the stack is a LIFO structure I concluded that the license key is KIWZ.

![License Key](/images/winutil-10.png)

I'm not sure if how I solve this is correct or my thought process is correct but that's how I came up with the answer. I'm still learning and I believe I'll improve more on how to reverse engineer stuff!

