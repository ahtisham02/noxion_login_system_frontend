import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { Navigate } from 'react-router';

const AuthRegister = ({ title, subtitle, subtext }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState();
    function onRegister(ev) {
        ev.preventDefault();
        try {
            const response = fetch("http://vmi2000569.contaboserver.net:4000/api/register", {
                method: "POST",
                body: JSON.stringify({ username, password }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.status === 200) {
                setResponse(response.status)
            }
        }
        catch (e) {
            throw e;
        }
    }

    if (response === 200) {
        return <Navigate to="/" replace={true} />
    }

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='name' mb="5px">User Name</Typography>
                    <CustomTextField id="name" variant="outlined" fullWidth value={username} onChange={(ev) => { setUsername(ev.target.value) }} />

                    {/* <Typography variant="subtitle1"
                    fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">Email Address</Typography>
                <CustomTextField id="email" variant="outlined" fullWidth /> */}

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">Password</Typography>
                    <CustomTextField id="password" variant="outlined" fullWidth value={password} onChange={(ev) => { setPassword(ev.target.value) }} />
                </Stack>
                <Button color="primary" variant="contained" size="large" fullWidth onClick={onRegister}>
                    Sign Up
                </Button>
            </Box>
            {subtitle}
        </>
    );
}

export default AuthRegister;
