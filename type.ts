import {relative, resolve} from "node:path";
import { Expression, exprType } from "./expr";
import { Function, fnType, isResolutionPass } from "./main";
import { Statement, stmtType } from "./stmt";
import { Token, colors } from "./token";
import { cwd } from "node:process";


var modules:string[] = ["mod_main"];
var module_stack = ["mod_main"];

export function pushModule(name:string) {
    modules.push(name);
    module_stack.push(name);
}

export function popModule() { 
    //console.error(modules);
    module_stack.pop(); 
}

export function getPresentModule():string { return module_stack.at(-1) as string; }

export function searchModule(name:string) {
    //console.error(modules, modules.find((m)=> m===name), name);
    return modules.find((m)=> m===name)
};

export enum myType {
    u8,
    u16,
    u32,
    u64,
    i8,
    i16,
    i32,
    i64,
    f32,
    f64,
    void,
    struct,
    enum,
    slice,
    string,
    ptr,
    array,
    bool,
    function,
    template,
    tuple
}

export function alignTo(align: number, n: number): number {
    return (n + align - 1) & ~(align - 1);
}

export function isNumber(T: Type): boolean {
    switch (T.kind) {
        case myType.u8:
        case myType.u16:
        case myType.u32:
        case myType.u64:
        case myType.i8:
        case myType.i16:
        case myType.i32:
        case myType.i64:
            return true;
        default: return false;
    }
}

class TagScope {
    enums:Type[] = [];
    structs:Type[] = [];
    constructor(){
        this.enums = [];
        this.structs = [];
    }
}

var tag_scopes:TagScope[] = [];

// export var tag_scope_states:TagScope[][] = [];
// 
// function saveTscopeState() {
//     var t_copy:TagScope[] = [];
//     tag_scopes.forEach((t)=>{
//         var tg = new TagScope();
//         t.enums.forEach((e)=>{
//             tg.enums.push(e);
//         })
//         t.structs.forEach((s)=>{
//             tg.structs.push(s);
//         })
//         t_copy.push(tg);
//     })
//     tag_scope_states.push(t_copy);
// }

export function beginTagScope() {
    if(isResolutionPass()){
        var tg = new TagScope();
        tag_scopes.splice(0,0,tg);
    }
}

// export function endTagScope() {
//     if(isResolutionPass()) {
//         tag_scopes.splice(0,1);
//     } else {
//         tag_scopes.splice(0,1);
//     }
// 
// }

function tokenError(message:string, tok:Token) {
    console.error(`${colors.yellow + relative(cwd(),tok.file_name) + colors.green}:${tok.line}:${tok.col} ${colors.red + message}${colors.reset} `);
    process.exit();
}

var struct_types: Type[] = [];

export function pushStructType(struc:Type,tok:Token) {
    //console.error(isResolutionPass(), "===============");
    for(let s of tag_scopes[0].structs) {
        if(s.name === struc.name) {
            tokenError(`struct ${struc.name} already exists at ${relative(cwd(), s.token.file_name)}:${s.token.line}:${s.token.col}`, tok);

        }
    }
    struc.token = tok;
    tag_scopes[0].structs.push(struc);
    struct_types.push(struc);
}

export function searchStruct(name:string):Type|undefined {
    for (let scope of tag_scopes) {
        for (let v of scope.structs) {
            if (v.name === name) {
                //console.error(v, isResolutionPass())
                return v;
            }
        }
    }
}

export function logStructs() {
    console.error(struct_types);
}


var enums: Type[] = [];


export function pushEnum(en: Type, tok:Token) {
    for(let e of tag_scopes[0].enums) {
        if(e.name === en.name) {
            tokenError(`enum ${e.name} already exists at ${relative(cwd(),e.token.file_name)}:${e.token.line}:${e.token.col}`, tok);
        }
    }
    en.token = tok;
    tag_scopes[0].enums.push(en);
    enums.push(en);
}

export function getEnum(name: string) {
    for (let scope of tag_scopes) {
        for (let v of scope.enums) {
            if (v.name === name) {
                return v;
            }
        }
    }
    return null;
}

export function getOffsetOfMember(struct: Type, tok:Token) {
    if(isResolutionPass()) return { offset: -11, datatype: voidtype, name: "" };
    var member = tok.value as string;
    for (let m of struct.members) {
        if (m.name === member) {
            return { offset: m.offset, datatype: m.type, name: "" };
        }
    }

    if(struct.member_fn_names) {
        if (struct.member_fn_names.find((n) => n === member)) {
            return { offset: -1, datatype: i64, name: struct.name + member }
        }
    }

    tokenError(member +" is not member of "+struct.toString(),tok);
    process.exit()
}

export class Type {
    kind: myType;
    size: number;
    align: number;

    token:Token;

    base: Type;
    arrayLen: number;
    members: { name: string, offset: number, type: Type, default:Expression|undefined }[];
    returnType: myType;

    enumvalues:{name:string, value:Expression}[];
    name:string;
    module_name:string;
    member_fn_names:string[];
    arguments: {name:string, datatype:Type}[];
    return_type:Type

    place_holder:string;

    arity:number;

    fn_type:fnType;
    is_tagged_union:boolean;
    tag:Type;
    on_index:number;

    newPointer(base: Type) {
        this.base = base;
        this.size = 8;
        this.align = 8;
        this.kind = myType.ptr;
        return this;
    }

    newArray(base: Type, len: number) {
        this.members = [];
        this.members.push(
            { name: "len", offset:0, type: u64, default: new Expression().newExprNumber(len, false) }
        )
        this.kind = myType.array;
        this.arrayLen = len;
        this.base = base;
        this.size = base.size * len + 8;
        this.align = 8;
        return this;
    }

    newSlice(base:Type):Type {
        this.members =  [
            { name: "len", offset:0, type: u64, default: undefined },
            { name: "ptr", offset:8, type: new Type().newPointer(base), default: undefined }
        ]
        this.kind = myType.slice;
        this.size = 16;
        this.align = 8;
        this.base = base;
        return this;
    }

    newStruct(name:string, mems: { name: string, datatype: Type, default:Expression|undefined }[]) {
        this.name = name;
        //this.module_name = getPresentModule() as string;
        this.member_fn_names = [];
        this.members = [];
        this.kind = myType.struct;
        var offt = 0;
        this.align = 0;
        mems.forEach((m) => {
            getPresentModule();
            offt = alignTo(m.datatype.align, offt);
            this.members.push({ name: m.name, offset: offt, type: m.datatype , default:m.default});
            offt += m.datatype.size;

            if (this.align < m.datatype.align) {
                this.align = m.datatype.align;
            }
        });
        this.size = alignTo(this.align, offt);
        return this;
    }

    newUnion(name: string,mems: {name: string, datatype:Type, default:Expression|undefined}[]) {
        this.name = name;
        this.members = [];
        this.kind = myType.struct;
        var offt = 0;
        this.align = 0;
        var lagest = 0;
        mems.forEach((m) => {
            offt = alignTo(m.datatype.align, offt);
            //offt += m.datatype.size;
            
            if (this.align < m.datatype.align) {
                this.align = m.datatype.align;
            }

            if (lagest < m.datatype.size) {
                lagest = m.datatype.align;
            }
        });
        
        mems.forEach((m)=>{
            this.members.push({ name: m.name, offset: offt, type: m.datatype, default:m.default });
        })

        this.size = alignTo(this.align, lagest);
        //console.error(offt);
        return this;
    }

    newTaggedUnion(name: string ,mems: {name: string, datatype:Type, default:Expression|undefined}[], tag:Type) {
        this.name = name;
        this.members = [];
        var offset = alignTo(tag.align, 0);
        this.members.push({name:"tag", offset:offset, type:tag as Type, default:undefined});
        offset+= tag.size;
        this.align = tag.align;
        var largest_size = tag.size;
        mems.forEach((m) => {
            offset = alignTo(m.datatype.align, offset);
            if (this.align < m.datatype.align) {
                this.align = m.datatype.align;
            }
            if (largest_size < m.datatype.size) {
                largest_size = m.datatype.align;
            }
        });

        mems.forEach((m)=>{
            this.members.push({ name: m.name, offset: offset, type: m.datatype, default:m.default });
        })
        offset += largest_size;
        this.size = alignTo(this.align, offset);
        this.is_tagged_union = true;
        this.tag = tag;
        this.kind = myType.struct
        return this;
    }

    newEnum(name:string, mems:{name:string, value:Expression}[]) {
        if(name === "") name+=enums.length;
        this.module_name = getPresentModule() as string;
        this.kind = myType.enum;
        this.size = 4;
        this.align = 4;
        this.enumvalues = mems;
        this.name = name;
        this.enumvalues.forEach((ev)=>{
            ev.value.datatype = this;
        })
        return this;
    }

    newType(t: myType, size: number, align: number) {
        this.kind = t;
        this.size = size;
        this.align = align;
        return this;
    }

    newFunction(return_type:Type, args_types:{name:string, datatype:Type}[], fn_type:fnType) {
        this.size = 8;
        this.align = 8;
        this.return_type = return_type;
        this.arguments = args_types;
        this.kind = myType.function;
        this.arity = args_types.length;
        this.fn_type = fn_type;
        return this;
    }

    newTemp(place_holder:string) {
        this.place_holder = place_holder;
        this.kind = myType.template;
        return this;
    }

    isString():boolean {
        return this.kind === myType.slice && this.base === u8;
    }

    toString() {
        switch(this.kind) {
            case myType.void:
                return "void";
            case myType.i8:
                return "i8";
            case myType.i16:
                return "i16";
            case myType.i32:
                return "i32";
            case myType.i64:
                return "i64";
            case myType.u8:
                return "u8";
            case myType.u16:
                return "u16";
            case myType.u32:
                return "u32";
            case myType.u64:
                return "u64";
            case myType.bool:
                return "bool";
            case myType.f32:
                return "f32";
            case myType.enum:
            case myType.struct:
                return this.name;
            case myType.ptr:
                return "*"+this.base.toString();
            case myType.tuple:
                return "tuple";
            case myType.array:
                return `[${this.arrayLen}]`+this.base.toString();
            case myType.slice:
                return "&"+this.base.toString();
            default:
                throw new Error("Unhandled type");
        }
    }

    static getTypeByName(name:string):Type|undefined {
        switch(name) {
            case "void":
                return voidtype;
            case "i8":
                return i8;
            case "i16":
                return i16;
            case "i32":
                return i32;
            case "i64":
                return i64;
            case "u8":
                return u8;
            case "u16":
                return u16;
            case "u32":
                return u32;
            case "u64":
                return u64;
            case "bool":
                return bool;
            case "f32":
                return f32;
            default:
                return undefined;
                //throw new Error("Unhandled type");
        }
    }

    isInteger():boolean {
        switch(this.kind) {
            case myType.u8:
            case myType.u16:
            case myType.u32:
            case myType.u64:
            case myType.i8:
            case myType.i16:
            case myType.i32:
            case myType.i64:
            case myType.f32:
            case myType.f64:
            case myType.bool:
            case myType.ptr:
            return true;
        }
        return false;
    }

    isPtr() {
        return this.kind === myType.ptr;
    }

    hasMembers() {
        return this.kind === myType.slice || this.kind === myType.struct || this.kind === myType.array
         || this.kind === myType.tuple
    }

    eql(t:Type):boolean{
        return this.toString() === t.toString();
    }

    selfRefReplace(t:Type, curr:Type) {
        if(t.kind === myType.ptr || t.kind === myType.array) {
            if(t.base === self_ref) {
                t.base = curr;
            } else {
                this.selfRefReplace(t.base, curr);
            }
        }
    }

    replaceSelfRef() {
        if(this.kind !== myType.struct) return;

        this.members.forEach((m)=>{
            if(m.type === self_ref) {
                m.type = this;
            }

            if(m.type.kind === myType.ptr || m.type.kind === myType.array) {
                this.selfRefReplace(m.type, this);
            }
        })

        //console.error(this.members[1].type.base.base, isResolutionPass());
    }

    constructor() {
    }
}

//console.error(myType.i64);
export var i64 = new Type().newType(myType.i64, 8, 8);
export var i32 = new Type().newType(myType.i32, 4, 4);
export var i16 = new Type().newType(myType.i16, 2, 2);
export var i8 = new Type().newType(myType.i8, 1, 1);
export var u64 = new Type().newType(myType.u64, 8, 8);
export var u32 = new Type().newType(myType.u32, 4, 4);
export var u16 = new Type().newType(myType.u16, 2, 2);
export var voidtype = new Type().newType(myType.void, 8, 8);
export var bool = new Type().newType(myType.bool, 1, 1);
export var u8 = new Type().newType(myType.u8, 1, 1);
export var f32 = new Type().newType(myType.f32, 4, 4);
export var enm = new Type().newType(myType.enum, 4, 4);
export var nullptr = new Type().newPointer(voidtype);
export var argv = new Type().newPointer(voidtype);
export var self_ref = new Type().newPointer(voidtype);
