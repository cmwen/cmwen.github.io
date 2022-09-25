
export const Bookmark = ({name, url, description}) => {
  return (
    <div class="border rounded p-2 max-w-xs h-24 hover:animate-pulse">
        <a href={url} class="text-sky-300 text-lg ">{name}</a>
        <div class="text-xs">{description}</div>
    </div>
  )
}

export default Bookmark;