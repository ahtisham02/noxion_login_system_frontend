import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox
} from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import axios from '../../../utils/axios';

const AuthLogin = ({ title, subtitle, subtext }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    async function onLogin(ev) {
        ev.preventDefault();
        try {
            await axios.post("http://vmi2000569.contaboserver.net:4000/api/login", {
                username, password
            }).then(
                res => {
                    localStorage.setItem("token", res?.data?.token)
                    localStorage.setItem("userRole", res?.data?.userRole)
                    document.cookie = res?.data?.token;
                    console.log(res?.data?.userRole);
                    navigate("/home");
                }
            ).catch(e => {
                console.log(e);
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Stack>
                <Box>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='username' mb="5px">Username</Typography>
                    <CustomTextField id="username" variant="outlined" fullWidth value={username} onChange={(ev) => { setUsername(ev.target.value) }} />
                </Box>
                <Box mt="25px">
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" >Password</Typography>
                    <CustomTextField id="password" type="password" variant="outlined" fullWidth value={password} onChange={(ev) => { setPassword(ev.target.value) }} />
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Remeber this Device"
                        />
                    </FormGroup>
                    <Typography
                        component={Link}
                        to="/"
                        fontWeight="500"
                        sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                        }}
                    >
                        Forgot Password ?
                    </Typography>
                </Stack>
            </Stack>
            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={onLogin}
                >
                    Sign In
                </Button>
            </Box>
            {subtitle}
        </>
    );
}
export default AuthLogin;