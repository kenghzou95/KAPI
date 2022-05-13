import * as React from 'react';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Avatar, Grid, Card, CardContent, CardHeader, IconButton, Divider, TextField, Typography, Button, dividerClasses, FormControl } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { alpha } from "@mui/material";
import { orange, red, green, blue } from '@mui/material/colors';
import { api } from '../service/index'
import CircularProgress from '@mui/material/CircularProgress';
const icon = (
    <Paper sx={{ m: 1 }} elevation={4}>
        <Box component="svg" sx={{ width: 100, height: 100 }}>
            <Box
                component="polygon"
                sx={{
                    fill: (theme) => theme.palette.common.white,
                    stroke: (theme) => theme.palette.divider,
                    strokeWidth: 1,
                }}
                points="0,100 50,00, 100,100"
            />
        </Box>
    </Paper>
);

const color = {
    get: green[500],
    post: orange[500],
    delete: red[500],
    put: blue[500]
}

export default function SimpleFade() {

    const [checked, setChecked] = React.useState(false);

    const [subchecked, setSubChecked] = React.useState(false);

    const [stackedObj, setStackedObj] = React.useState({ 'get': {}, 'post': {}, 'put': {}, 'delete': {}, });
    const init = { expand: {}, parent: [], subexpand: {}, child: [] };
    const [render, setRender] = React.useState(false);
    const [state, setState] = React.useState(init);
    async function getData(url, formData, method) {
        let result = {};
        if (method == "get") result = await api.get(url, formData);
        else if (method == "post") result = await api.post(url, formData);
        else if (method == "put") { }

        let update = Object.assign({}, stackedObj);
        console.log(result)
        console.log(update)
        update[method][url] = JSON.stringify(result, null, 4);
        setStackedObj(update)

    }

    const handleSubmit = (event, url, method) => {
        console.log(event)
        console.log(url)
        let target = event.target;
        let formData = {};

        for (let i = 0; i < target.length; i++) {
            formData[target.elements[i].getAttribute("name")] = target.elements[i].value;
        }
        console.log(formData)
        delete formData['null']

        event.preventDefault();
        getData(url, formData, method)
        // console.log('formData', formData);
        //const pp = event.target.filter()
        // const url = props;
        // const param = event.target.body.value

        //  console.log(event.target.elements);





    }

    const handleTryApi = (url, param) => {
        api.post(url, param);
    }

    React.useEffect(() => {
        console.log('calling data')
        fetch(`http://127.0.0.1:1880/kapitest`)
            .then(results => results.json())
            .then(data => {
                let parent = data.map(function (obj) {
                    if (obj.isCustom == 1) {
                        return obj.customCategory;
                    } else {
                        return obj.category;
                    }
                }).reduce((unique, o) => {
                    if (!unique.some(obj => obj === o)) {

                        unique.push(o);
                    }
                    return unique;
                }, []);
                console.log({ ...state, parent })
                let child = data.map(function (obj) {
                    if (obj.isCustom == 1) {
                        obj.parent = obj.customCategory;
                    } else {
                        obj.parent = obj.category;
                    }
                    return obj
                })

                setState({ ...state, parent, child });
            });
        setRender(true)
    }, [])
    const handleChange = () => {
        setChecked((prev) => !prev);
    };
    const subhandleChange = () => {
        setSubChecked((prev) => !prev);
    };
    function handleHeight() {
        if (checked) return "expend"
        else return "normal"
    }
    const handleExpandClick = (id) => {
        let expand = state.expand;

        expand[id] = expand.hasOwnProperty(id) ? !expand[id] : true



        setState({ ...state, expand });

    }

    const handleSubExpandClick = (id) => {
        let subexpand = state.subexpand;

        subexpand[id] = subexpand.hasOwnProperty(id) ? !subexpand[id] : true



        setState({ ...state, subexpand });

    }




    const { parent, expand, child, subexpand } = state;
    const theme = createTheme({
        status: {
            danger: orange[500],
        },
    });


    return (
        <div>
            <ThemeProvider theme={theme}>

                {render && parent.map((e) => (
                    <Card className={handleHeight()} key={e} style={(expand[e]) ? { marginBottom: '20px', transitionDuration: '0.3s', background: "#fff" } : { marginBottom: '20px', transitionDuration: '0.3s', height: '50px', background: '#ee' }} >
                        <CardHeader
                            style={{ textAlign: 'left', color: '#b14444' }}
                            title={e}
                            action={
                                <IconButton aria-label="settings" onClick={() => handleExpandClick(e)} sx={{ color: '#b14444' }}>
                                    {expand[e] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            }
                        />
                        <Fade in={expand[e]}>
                            <CardContent >
                                {child.filter(el => el.parent == e).map((el) => (
                                    <Card className={handleHeight()} key={el.id} style={(subexpand[el.id]) ? { marginBottom: '20px', transitionDuration: '0.3s', background: alpha(color[el.method], 0.15) } : { marginBottom: '20px', transitionDuration: '0.3s', height: '80px', background: alpha(color[el.method], 0.15) }} >
                                        <CardHeader
                                            avatar={
                                                <Avatar sx={{ bgcolor: color[el.method], height: '30px', width: '80px' }} variant="square" aria-label="recipe">
                                                    {el.method}
                                                </Avatar>
                                            }
                                            style={{ textAlign: 'left' }}
                                            title={el.url}
                                            titleTypographyProps={{ variant: 'h5' }}
                                            subheader="Description"
                                            action={
                                                <IconButton aria-label="settings" onClick={() => handleSubExpandClick(el.id)} >
                                                    {subexpand[el.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            }
                                        ></CardHeader>
                                        <Fade in={subexpand[el.id]}>

                                            <CardContent>

                                                <Box sx={{ m: 2, p: 2, border: '1px dashed grey' }}>
                                                    <form onSubmit={(event) => { handleSubmit(event, el.url, el.method) }}>


                                                        <Grid container spacing={2} >
                                                            <Grid item xs={6} md={12}>
                                                                <Typography>Request</Typography>
                                                            </Grid>
                                                            <Grid item xs={6} md={12}>
                                                                <TextField
                                                                    id="outlined-multiline-static"
                                                                    label='Addition Parameter'
                                                                    name='additionParameter'

                                                                    fullWidth
                                                                />
                                                            </Grid>

                                                            {el.url.split("/").map((inForm) => {

                                                                if (inForm.includes(":")) {
                                                                    return (<Grid item xs={6} md={12}>
                                                                        <TextField
                                                                            id="outlined-multiline-static"
                                                                            label={inForm}
                                                                            name={inForm}

                                                                            fullWidth
                                                                        />

                                                                    </Grid>)
                                                                }
                                                            })}
                                                            {el.method != "get" && <>
                                                                <Grid item xs={6} md={6}>
                                                                    <TextField
                                                                        id="outlined-multiline-static"
                                                                        label="Sample Body"
                                                                        disabled
                                                                        multiline
                                                                        rows={4}
                                                                        readOnly
                                                                        defaultValue={el.body}
                                                                        fullWidth
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6} md={6}>
                                                                    <TextField
                                                                        id="outlined-multiline-static"
                                                                        label="Body"
                                                                        name="body"
                                                                        multiline
                                                                        rows={4}

                                                                        defaultValue="Default Value"

                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                            </>


                                                            }

                                                            <Grid item xs={6} md={12}>
                                                                <Button variant="outlined" type="submit" disabled={el.method != "get"}>Request API</Button>
                                                            </Grid>

                                                        </Grid> </form>
                                                </Box>

                                                <Box sx={{ m: 2, p: 2, border: '1px dashed grey' }}>
                                                    <Grid container spacing={2} >
                                                        <Grid item xs={6} md={12}>
                                                            <Typography>Response</Typography>
                                                        </Grid>
                                                        <Grid item xs={6} md={6}>
                                                            <Typography>Expencted Response</Typography>
                                                        </Grid>
                                                        <Grid item xs={6} md={6}>
                                                            <Typography>Server Response</Typography>
                                                        </Grid>
                                                        <Grid item xs={6} md={6}>
                                                            <TextField
                                                                id="outlined-multiline-static"

                                                                multiline
                                                                rows={4}
                                                                disabled
                                                                // value={el.body}
                                                                defaultValue={el.body}
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6} md={6}>
                                                            <TextField
                                                                id="outlined-multiline-static"

                                                                multiline
                                                                disabled
                                                                rows={4}
                                                                //value={stackedObj[el.method][el.url]}
                                                                defaultValue={stackedObj[el.method][el.url]}
                                                                fullWidth
                                                            />
                                                        </Grid>


                                                    </Grid>
                                                </Box>

                                            </CardContent>

                                        </Fade>
                                    </Card>

                                ))}


                            </CardContent>
                        </Fade>
                    </ Card >
                ))
                }

            </ThemeProvider>
        </div >
    );
}
