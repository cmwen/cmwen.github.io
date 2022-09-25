import Bookmark from "./Bookmark";

export const Bookmarks = ({bookmarks}) => {
    return <div class="flex flex-row space-x-4">
        {
            bookmarks.map(bookmark => <Bookmark {...bookmark} />)
        }
    </div>
}

export default Bookmarks;