import styles from '../styles/Login.module.css';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useMutation} from "react-query";
import {useState} from "react";
import {useRouter} from "next/router";
import {getAPI} from "../utils";

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [pass, setPass] = useState<string>('');

    const {mutate} = useMutation({
        mutationFn: (data: Record<string, string>) => getAPI('/', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        mutationKey: 'login',
        onError: () => alert('Error in Login Attempt'),
    })

    const handleSubmit = () => {
        const data = {
            username,
            password: pass,
        }
        console.log('submitted data', data);
        mutate(data, {
            onSuccess: () => {
                localStorage.setItem('loginInfo', JSON.stringify({isLoggedIn: true}));
                return router.push('/home');
            },
        });
    }

    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <section>
                <TextField placeholder="username" fullWidth label="Username" onChange={(e) => setUsername(e.target.value)} value={username}/>
                <TextField placeholder="password" fullWidth  type="password" label="Password" onChange={(e) => setPass(e.target.value)} value={pass}/>
                <Button disabled={!username || !pass} variant="contained" fullWidth onClick={handleSubmit}>Login</Button>
            </section>
        </div>
    );
}

export default Login;