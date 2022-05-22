// declaration.d.ts
declare module '*.scss' {
  const content: Record<string, string>
  export default content
}
declare module '*.css' {
  const content: Record<string, string>
  export default content
}
declare module '*.svg' {
  const content: any
  export default content
}

declare interface PayloadAction<T> {
  type: string
  payload?: T
}
