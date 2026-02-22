export interface Language {
    name: string,
    label:string,
    id:number
};

export const availableLanguages:Language[] = [
    { name: "cpp", label: "main.cpp", id: 54 },
  { name: "c", label: "main.c", id: 50 },
  { name: "javascript", label: "script.js", id: 63 },
  { name: "python", label: "script.py", id: 71 },
  { name: "java", label: "Main.java", id: 62 },
  { name: "csharp", label: "Program.cs", id: 51 },
  { name: "typescript", label: "index.ts", id: 74 },
  { name: "php", label: "index.php", id: 68 },
  { name: "go", label: "main.go", id: 60 },
  { name: "rust", label: "main.rs", id: 73 },
  { name: "ruby", label: "script.rb", id: 72 },
  { name: "swift", label: "main.swift", id: 83 },
  { name: "kotlin", label: "Main.kt", id: 78 },
  { name: "scala", label: "Main.scala", id: 81 },
  { name: "r", label: "script.r", id: 80 },
  { name: "shell", label: "script.sh", id: 46 }, 
  { name: "haskell", label: "main.hs", id: 61 },
  { name: "lua", label: "script.lua", id: 64 },
  { name: "pascal", label: "main.pas", id: 67 },
  { name: "perl", label: "script.pl", id: 85 }
];
