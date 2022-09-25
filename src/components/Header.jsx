
const Header = ({title, links}) => {
    return <header class="sticky top-0 p-4 bg-purple-800 text-slate-200 flex item-start mx-auto max-w-6xl hover:animate-pulse space-x-3">
        <a href="/" class="text-xl flex-1">Welcome to {title}</a>
        {
            links.map(link => <a href={link.url} class="text-sm">{link.name}</a>)
        }
    </header>
}

export default Header;