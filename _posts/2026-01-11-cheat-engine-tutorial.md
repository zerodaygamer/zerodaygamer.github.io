---
layout: post
title: "[GameHacking] - Cheat Engine Step 9"
date: 2026-01-11 23:49:10
category: gh
---
Well, its been a while since I posted. So to restore my blog, I decided to just show my solution on how I solved Cheat Engine Step 9 tutorial.

I'm following GuidedHacking Game Hacking Bible (Again) since I stopped with Game Hacking to pursue certifications stuff but this time, I promise to focus on Game Hacking instead and less certification for this year.

Since, I just came back, I decided to redo all the Guided Hacking tutorial and now, I'm on Step 5 "Cheat Engine Tutorial Video Guide"

I'll skipped all the other process and just put my solution here.

```asm
alloc(newmem,2048)
label(returnhere)
label(originalcode)
label(enemy)
label(exit)

newmem: //this is allocated memory, you have read,write,execute access
cmp [ebx+10],1
jne enemy
fldz
jmp originalcode+5

enemy:
mov [ebx+04],0
fldz
jmp exit

originalcode:
mov [ebx+04], eax
fldz

exit:
jmp returnhere

"Tutorial-i386.exe"+29D8D:
jmp newmem
returnhere:
```

This is my code injection and using this, I was able to solve the last part that should instakill the 2 enemy but will keep my 2 player alive.
