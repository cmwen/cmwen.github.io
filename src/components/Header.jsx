
const Header = ({title, links}) => {
    return <div class="sticky top-0 p-4 bg-purple-800 text-slate-200 flex">
        <p class="text-xl flex-1">Welcome to {title}</p>
        {
            links.map(Link => <Link />)
        }
    </div>
}

export default Header;