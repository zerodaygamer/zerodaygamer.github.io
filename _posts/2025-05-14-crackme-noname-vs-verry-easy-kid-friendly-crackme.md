---
layout: post
title: "[CrackMe] - NoName_vs' Verry easy kid friendly crackme"
date: 2025-05-14 15:29:08
category: re
---
Another crackme solved! -- Just got lucky!!

So far this is the crackme that took me a while to solve. Not Verry easy (for me), since it took me a lot of time to solve this but overall, it is great! It will teach you a lot of stuff in performing reverse engineering.

Here's the detail of the Crackme made by NoName_vs
![Verry easy kid friendly](/images/verryeasy-1.png)

Running the executable would display a MessageBox that says "anti nga protection". Its confusing at first since there is no debugger or disassembler running on the background so my initial thought was maybe because this executable is able to detect that I am running it on a Virtual Machine. I find this cool as this executable is able to implement defense mechanism and I'll be able to try to bypass those in order to properly understand how the executable works.

![anti nga protection](/images/verryeasy-2.png)

So before running this on x64dbg, I have everything set in mind that this executable has a lot of defensive mechanism in place! 

![CFF Explorer](/images/verryeasy-3.png)

I always disable DLL can move in CFF explorer to ensure that my breakpoints would be reliable and also I want to make sure I can see the address in Ghidra as well. If I won't disable ASLR, the address could be different everytime I load it on x64dbg.

Ok, hear me out, initially I mentioned that I have set in mind that this executable has a lot of defensive mechanism in place so when I saw the TLS Callback on the breakpoint I was like damn there's a TLS callback. I might as well search for it but before I took my time here I just run this on PE-Bear and CFF explorer and saw that TLS Callback do not have a value and that is where I realized that it is on gdi32full.dll not on my executable. I had to use both PE-Bear and CFF Explorer to confirm and once I confirmed, I return to x64dbg and damn I was noob haha!

Anyways, I run the executable until I am at the Entry Point of the executable. After that, I went on to perform "Search For > Current Region > String References". Since we know the error message after running the executable which is the "anti nga protection" we can search for that.

![String Reference](/images/verryeasy-5.png)

Now, I follow the string in the disassembler.

![Disassembler](/images/verryeasy-6.png)

Following in the disassembler, I was able to see some pointers loaded to RDX before a CALL instruction and the contents are strings like VMware, VBox, etc. After the CALL instruction it will perform test rax, rax then run the JNE instruction. 

![VMware String](/images/verryeasy-7.png)

I noticed the Jump Not Equal instruction to be jumping to the string "anti nga protection" if condition not met. So what I did, I patched this executable simply changing the test eax, eax to xor eax, eax from all the checks that I feel relevant for me such as IsDebuggerPresent, VMWare, Microsoft, x64dbg. Once I am able to run the executable in debugger without encountering the error "anti nga protection" then I'm all good.

![Login](/images/verryeasy-8.png)

After patching, I run the executable again in the debugger. This time, instead of receiving an error prompt, I was able to see a string "Login:" in the prompt.

![Wrong Login](/images/verryeasy-9.png)

 I tried inputting password such as "zerodaygamer" and received a "Wrong!" response but I noticed that the debugger does not seem to react or change? I'm not sure what happen but it feels like this prompt is not happening within the executable. Then I thought to myself there must be something wrong with I did, so I restart the executable within the debugger then input the same password "zerodaygamer" again. This time I was able to see my input in the CPU region or disassembler.

![Restart Again](/images/verryeasy-10.png)

As you can see on the CPU region, there is zerodaygamer on 0x1400020B9 and 0x1400020DC. One is to store my input in rbp while the other is to clear my inputs from r15 by xor. Knowing that at 0x1400020B9, the pointer to my input is accessed then storing that to rbp, I set a hardware breakpoint on that address. Then this time I tried using "zerodaygamer" as Login creds then nothing happens. I removed the hardware breakpoint and tried setting a normal breakpoint but this time, after setting a breakpoint, the R15 on register appears to have a value which is my input zerodaygamer.

![R15](/images/verryeasy-11.png)

I right click the value in R15 and select follow in dump, once in dump, I select breakpoint > Hardware, Access > Byte. The reason for this is that it should hit a breakpoint whenever the application tries to access my input.

![Breakthrough](/images/verryeasy-12.png)

Yes, I did it! I am now somewhere in memory where the executable is accessing my inputs, probably to compare? Not yet sure. 

Since I am already here and not sure what to look for next, I did what a beginner like me would do, without any idea of what's going on. Click step over and hope that I would stumble on something. Then nothing, I reached the "Login:" prompt again without seeing something that interest me. So, rerun again! This time I look closely!

![Looping](/images/verryeasy-13.png)

I saw a loop, but since I have step over this one earlier, I now know that this one is counting the character in my inputs but not sure why though. So this time, I copy the address and look it up on Ghidra and maybe from there I can clearly understand this part.


![Ghidra](/images/verryeasy-14.png)

Upon checking the address on Ghidra, I was able to see on the decompiler that there is a check if the string contains 8 characters. Since zerodaygamer is longer than 8 character, I thought to myself, what if the length of my input is also 8 character, that's where I thought of using 'password' as my input.

![Don't look back](/images/verryeasy-15.png)

There's a difference between stepping over using 'zerodaygamer' and 'password' as inputs. This time, I felt like it takes a little longer before "Wrong!" is displayed on the prompt so I keep on clicking F8 and then I reach a part of the memory where I was able to see "Access Granted" on the CPU region. This feels like I'm getting somewhere.

![Let me in](/images/verryeasy-16.png)

After hitting the call at the memory address 0x1400027B0, I saw the string letmein in my Registers and found this a little fishyyyy!! Is this what I'm looking for??? So before I try this one, I set a breakpoint on the CALL instruction then copy that address and look it up on Ghidra.

![Let me in](/images/verryeasy-17.png)

In Ghidra, I was planning on going inside the Call to FUN_140001fb0 but saw that above it, on the address 0x14000277f, there is a DATA address with value 003B3C3038213039h. I double clicked that one to go directly to it. There I right click DAT_14002f9b0 and select Data > string.

![Let me in](/images/verryeasy-18.png)

After converting it to string, it looked gibberish to me but feels like it was obfuscated since after the call I was able to see letmein on the Registers.

![Function to Debofuscate](/images/verryeasy-19.png)

I now proceeded to go inside the function and when I checked the decompiler, I saw the string 0x55 and thought to myself instantly that is the XOR key for this, is gotta be it, right?

![Cyberchef](/images/verryeasy-20.png)

So without hesitating, I quickly open Cyberchef and then voila. I was able to see the function that deobfuscate the hex string and also saw the correct credential "letmein"

![Cyberchef](/images/verryeasy-21.png)

I was able to solve it but there's something wrong. The password is correct but the author mentioned that if I'm correct, it will open a website but this one does not. I decided to redo everything but still using the 'password' as my password since that's where it got me to where I am and probably see where are the other checks I overlook.

![Another String](/images/verryeasy-22.png)

I saw another string in my register and this time it is 'aikmnioi'. After stepping over on 0x1400028C4, that string shows up on my register. Continuing stepping over, I was not able to hit anything that would tell me how aikmnioi was deobfuscated.

![Reference to local_2f8](/images/verryeasy-23.png)

I open Ghidra again and this time go directly to 0x1400028C4, from there I right clicked local_2f8 and shows references to that variable. I selected the first one which is 0x140002641.

![Hex again](/images/verryeasy-24.png)

On the Listing view, on memory address 0x14000262b, there seems to be a hex character which looks like the same like 'letmein'. I clicked it and select convert > Character Sequence

![Convert that hex](/images/verryeasy-25.png)

Now that the value is change, we can see a CALL to  FUN_140001fb0, which is the function that is called also in order to deobfuscate 'letmein' earlier. With that in mind, we can also deobfuscate tha character sequence using 0x55 as XOR key

![Chef again](/images/verryeasy-26.png)

And there it is, I was able to see and confirmed that the second password is aikmnioi, it is in reverse in the screenshot probably because of LIFO structure.

![Access is Granted!](/images/verryeasy-27.png)

Inputting the password 'aikmnioi' shows an error but with string "Access Granted".

![That's the website](/images/verryeasy-28.png)

Clicking the 'Ok' button will open the website the author mentioned. 

That was it, finally able to solve another CrackMe. This is tougher that what I thought it would be since the tile says "Verry Easy". 














