
export function getUserInitials(name: string){
  const names = name.split(" ")
  const initials = names.reduce((initials, name) => {
    return initials + name.charAt(0).toLocaleUpperCase()
  }, "")

  return initials
}