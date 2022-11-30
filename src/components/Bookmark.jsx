
export const Bookmark = ({name, url, description}) => {
  return (
    <div class="border rounded p-3 max-w-xs h-24 hover:animate-pulse">
        <a href={url} class="text-sky-300 text-lg block">{name}</a>
        <span class="text-xs">{description}</span>
    </div>
  )
}

export default Bookmark;