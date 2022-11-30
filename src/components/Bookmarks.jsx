import { createSignal } from "solid-js";
import Bookmark from "./Bookmark";
import Dropdown from "./Dropdown";

const populateTags = (bookmarks) => {
  const tagSet = new Set();

  bookmarks
    .map((bookmark) => bookmark.tags)
    .forEach((tags) => {
      tags.forEach((tag) => tagSet.add(tag));
    });

  return [...tagSet.values()];
};

export const Bookmarks = ({ bookmarks }) => {
  const tags = populateTags(bookmarks);
  const [tagFilter, setTagFilter] = createSignal("");

  console.log(tagFilter());
  const onFilterChange = (env) => {
    setTagFilter(env.target.value);
  };

  return (
    <>
      <Dropdown
        label="Tags"
        options={["", ...tags]}
        onChange={onFilterChange}
      />
      <div class="flex flex-wrap flex-row space-x-4">
        {bookmarks
          .filter(
            (bookmark) =>
              tagFilter() === "" || bookmark.tags.includes(tagFilter())
          )
          .map((bookmark) => (
            <Bookmark {...bookmark} />
          ))}
      </div>
    </>
  );
};

export default Bookmarks;
