
const Header = ({title, links}) => {
    return <header class="sticky top-0 p-4 bg-purple-800 text-slate-200 flex item-start mx-auto max-w-6xl">
        <p class="text-xl flex-1">Welcome to {title}</p>
        {
            links.map(Link => <Link />)
        }
    </header>
}

export default Header;