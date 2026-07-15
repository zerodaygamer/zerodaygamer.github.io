---
layout: post
title: "[CrackMe] - kwenma's C++ Obfuscator"
date: 2025-05-01 13:27:48
category: re
---
I now went to solve another Crackme challenge. The difficulty rating of this one is 2.8 and the quality is 4.0. 

How I solve crackme is, if I got the correct password then it's done. As long as I'm able to get the correct one then I conclude that the challenge is over. I'm not sure if this is the way but I figure that since it only ask for the password and if I provided it correctly then the challenge is done.

Running the executable would ask you to enter a password, wrong password will result to a string response of "noob" and the executable closes.

![Executing the exe file](/images/obfuscator-1.png)

I opened this on Ghidra right away to see some symbols worth noting or even strings so I can see where I can start to look.

![Symbol Reference](/images/obfuscator-2.png)

I tried searching for the string "noob" but was not able to see it on Defined Strings. This could mean that the string is obfuscated in some way then maybe it is deobfuscated in some point to compare the user input to the correct password then print "noob" if it is incorrect.

Since that is the theory I thought of, I opened x64dbg. Before I open the executable on x64dbg, I make sure to uncheck the "DLL can move" using CFF explorer so that the address will be the same with the one in Ghidra since ASLR randomize the Memory Address when it runs.

![x64dbg](/images/obfuscator-3.png)

After loading the executable on x64dbg, I run it once to make sure it will pause on the Entry Point of the executable. Once it is on the Entry Point, I search for intermodular calls / API calls on the current region.

![Intermodular Calls](/images/obfuscator-4.png)

These are some of the intermodular calls in the memory region. I thought of setting a breakpoint on one of the iostream but I opted to manually step over and watch the registers to see if there is something interesting happening.

![Stepping over memory address](/images/obfuscator-5.png)

While I manually step over, I noticed a loop starting on address "0000000140005513". Then a call on "0000000140005516". 

![Loop](/images/obfuscator-6.png)

Allowing the loop to run, we can see that the registers display the unobfuscated version of the correct password which is "thisisverysecret"

If we try to input "thisisverysecret" without x64dbg, simply input it on the executable, we won't see anything and it just closes but this time without the word "noob".

![Correct License Key](/images/obfuscator-7.png)

I run this again on debugger to check if that is normal, then I saw that there is another loop that occurs starting from the memory address "0000000140005637". If we allow the executable to run or execute this loop.

![Wow So Pro](/images/obfuscator-8.png)

We can see that it prints or outputs "wow so pro".