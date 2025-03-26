import useTheme from './hooks/useTheme';

export default function App() {
    const { theme, toggleTheme } = useTheme();
    console.log(theme);

    return <div></div>;
}
