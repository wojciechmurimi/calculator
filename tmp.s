.intel_syntax noprefix
.data
.align 8
.L.data.bytes.0:
   .quad 1
   .byte 0x71 
   .byte 0
.align 8
.L.data.strings.0:
   .quad 1
   .quad offset .L.data.bytes.0 + 8
.align 8
.L.data.bytes.1:
   .quad 0
   .byte 0
.align 8
.L.data.strings.1:
   .quad 0
   .quad offset .L.data.bytes.1 + 8
.align 8
.L.data.bytes.2:
   .quad 4
   .byte 0x6f 
   .byte 0x6e 
   .byte 0x65 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.2:
   .quad 4
   .quad offset .L.data.bytes.2 + 8
.align 8
.L.data.bytes.3:
   .quad 5
   .byte 0x65 
   .byte 0x6c 
   .byte 0x73 
   .byte 0x65 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.3:
   .quad 5
   .quad offset .L.data.bytes.3 + 8
.align 8
.L.data.bytes.4:
   .quad 9
   .byte 0x74 
   .byte 0x65 
   .byte 0x73 
   .byte 0x74 
   .byte 0x3a 
   .byte 0x20 
   .byte 0x6f 
   .byte 0x6b 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.4:
   .quad 9
   .quad offset .L.data.bytes.4 + 8
.align 8
.L.data.bytes.5:
   .quad 11
   .byte 0x74 
   .byte 0x65 
   .byte 0x73 
   .byte 0x74 
   .byte 0x3a 
   .byte 0x20 
   .byte 0x66 
   .byte 0x61 
   .byte 0x69 
   .byte 0x6c 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.5:
   .quad 11
   .quad offset .L.data.bytes.5 + 8
.align 8
.L.data.bytes.6:
   .quad 9
   .byte 0x74 
   .byte 0x65 
   .byte 0x73 
   .byte 0x74 
   .byte 0x3a 
   .byte 0x20 
   .byte 0x6f 
   .byte 0x6b 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.6:
   .quad 9
   .quad offset .L.data.bytes.6 + 8
.align 8
.L.data.bytes.7:
   .quad 11
   .byte 0x74 
   .byte 0x65 
   .byte 0x73 
   .byte 0x74 
   .byte 0x3a 
   .byte 0x20 
   .byte 0x66 
   .byte 0x61 
   .byte 0x69 
   .byte 0x6c 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.7:
   .quad 11
   .quad offset .L.data.bytes.7 + 8
.align 8
.L.data.bytes.8:
   .quad 1
   .byte 0x71 
   .byte 0
.align 8
.L.data.strings.8:
   .quad 1
   .quad offset .L.data.bytes.8 + 8
.align 8
.L.data.bytes.9:
   .quad 0
   .byte 0
.align 8
.L.data.strings.9:
   .quad 0
   .quad offset .L.data.bytes.9 + 8
.align 8
.L.data.bytes.10:
   .quad 4
   .byte 0x6f 
   .byte 0x6e 
   .byte 0x65 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.10:
   .quad 4
   .quad offset .L.data.bytes.10 + 8
.align 8
.L.data.bytes.11:
   .quad 5
   .byte 0x65 
   .byte 0x6c 
   .byte 0x73 
   .byte 0x65 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.11:
   .quad 5
   .quad offset .L.data.bytes.11 + 8
.align 8
.L.data.bytes.12:
   .quad 9
   .byte 0x74 
   .byte 0x65 
   .byte 0x73 
   .byte 0x74 
   .byte 0x3a 
   .byte 0x20 
   .byte 0x6f 
   .byte 0x6b 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.12:
   .quad 9
   .quad offset .L.data.bytes.12 + 8
.align 8
.L.data.bytes.13:
   .quad 11
   .byte 0x74 
   .byte 0x65 
   .byte 0x73 
   .byte 0x74 
   .byte 0x3a 
   .byte 0x20 
   .byte 0x66 
   .byte 0x61 
   .byte 0x69 
   .byte 0x6c 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.13:
   .quad 11
   .quad offset .L.data.bytes.13 + 8
.align 8
.L.data.bytes.14:
   .quad 9
   .byte 0x74 
   .byte 0x65 
   .byte 0x73 
   .byte 0x74 
   .byte 0x3a 
   .byte 0x20 
   .byte 0x6f 
   .byte 0x6b 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.14:
   .quad 9
   .quad offset .L.data.bytes.14 + 8
.align 8
.L.data.bytes.15:
   .quad 11
   .byte 0x74 
   .byte 0x65 
   .byte 0x73 
   .byte 0x74 
   .byte 0x3a 
   .byte 0x20 
   .byte 0x66 
   .byte 0x61 
   .byte 0x69 
   .byte 0x6c 
   .byte 0xa 
   .byte 0
.align 8
.L.data.strings.15:
   .quad 11
   .quad offset .L.data.bytes.15 + 8
.bss
.data
.align 8
__argc__: .quad 0
__argv__: .quad 0
.text

.global _start
_start:
   mov rax, [rsp]
   lea rcx, [rsp+8]
   mov [__argc__], rax
   mov [__argv__], rcx
   call main
   mov rdi, rax
   mov rax, 60
   syscall
.text
.global main
main:
   push rbp
   mov rbp, rsp
   sub rsp, 16
   lea rax, [rbp-16]
   push rax
   lea rax, .L.data.strings.8
   pop rdi
   mov cl, [rax+0]
   mov [rdi+0], cl
   mov cl, [rax+1]
   mov [rdi+1], cl
   mov cl, [rax+2]
   mov [rdi+2], cl
   mov cl, [rax+3]
   mov [rdi+3], cl
   mov cl, [rax+4]
   mov [rdi+4], cl
   mov cl, [rax+5]
   mov [rdi+5], cl
   mov cl, [rax+6]
   mov [rdi+6], cl
   mov cl, [rax+7]
   mov [rdi+7], cl
   mov cl, [rax+8]
   mov [rdi+8], cl
   mov cl, [rax+9]
   mov [rdi+9], cl
   mov cl, [rax+10]
   mov [rdi+10], cl
   mov cl, [rax+11]
   mov [rdi+11], cl
   mov cl, [rax+12]
   mov [rdi+12], cl
   mov cl, [rax+13]
   mov [rdi+13], cl
   mov cl, [rax+14]
   mov [rdi+14], cl
   mov cl, [rax+15]
   mov [rdi+15], cl
   lea rax, .L.data.strings.9
   add rax, 0
   mov rax, [rax]
   cmp rax, 1
   je .L.1.p.0
   jmp .L.1.p.else
.L.1.p.0:
   lea rax, [write]
   push rax
   lea rax, .L.data.strings.10
   push rax
   pop rdi
   pop rax
   call rax
   jmp .L.end.1
.L.1.p.else:
   lea rax, [write]
   push rax
   lea rax, .L.data.strings.11
   push rax
   pop rdi
   pop rax
   call rax
.L.end.1:
.L.endfn.0:
   mov rsp, rbp
   pop rbp
   ret

.global write
write:
   push rbp
   mov rbp, rsp
   sub rsp, 8
   mov [rbp-8], rdi
# [inline asm]
   mov rsi, [rdi+8]
   mov rdx, [rdi +0]
   mov rdi, 1
   mov rax, 1
   syscall
# [end]
.L.endfn.2:
   mov rsp, rbp
   pop rbp
   ret

.global test
test:
   push rbp
   mov rbp, rsp
   sub rsp, 8
   mov [rbp-1], dil
   lea rax, [rbp-1]
   movsx rax, byte ptr [rax]
   cmp rax, 0
   je .L.else.4
   lea rax, [write]
   push rax
   lea rax, .L.data.strings.12
   push rax
   pop rdi
   pop rax
   call rax
   jmp .L.end.4
.L.else.4:
   lea rax, [write]
   push rax
   lea rax, .L.data.strings.13
   push rax
   pop rdi
   pop rax
   call rax
.L.end.4:
.L.endfn.3:
   mov rsp, rbp
   pop rbp
   ret

.global test_eql
test_eql:
   push rbp
   mov rbp, rsp
   sub rsp, 8
   mov [rbp-1], dil
   mov [rbp-2], sil
   lea rax, [rbp-2]
   movsx rax, byte ptr [rax]
   push rax
   lea rax, [rbp-1]
   movsx rax, byte ptr [rax]
   pop rdi
   cmp rax, rdi
   sete al
   movzb rax, al
   cmp rax, 0
   je .L.else.6
   lea rax, [write]
   push rax
   lea rax, .L.data.strings.14
   push rax
   pop rdi
   pop rax
   call rax
   jmp .L.end.6
.L.else.6:
   lea rax, [write]
   push rax
   lea rax, .L.data.strings.15
   push rax
   pop rdi
   pop rax
   call rax
.L.end.6:
.L.endfn.5:
   mov rsp, rbp
   pop rbp
   ret

