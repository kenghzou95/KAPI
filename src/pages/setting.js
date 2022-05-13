import * as React from 'react';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { orange, red, green, blue } from '@mui/material/colors';
import { api } from '../service/index'
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
const color = {
    get: green[500],
    post: orange[500],
    delete: red[500],
    put: blue[500]
}

async function updateRow(data) {

    const response = await axios.put('http://127.0.0.1:1880/kapi', data);

}

async function deleteRow(data) {
    const response = await axios.post('http://127.0.0.1:1880/kapi/del', data);

}
const useFakeMutation = () => {
    return React.useCallback(
        (row) =>
            new Promise((resolve, reject) =>
                setTimeout(() => {
                    if (row.name?.trim() === '') {
                        reject();
                    } else {
                        updateRow(row)
                        //{ ...row, name: row.name?.toUpperCase() }
                        resolve(row);
                    }
                }, 200),
            ),
        [],
    );
}

function computeMutation(newRow, oldRow) {
    if (newRow.body !== oldRow.body) {
        return `body from '${oldRow.body}' to '${newRow.body}'`;
    }
    if (newRow.response !== oldRow.response) {
        return `response from '${oldRow.response || ''}' to '${newRow.response || ''}'`;
    }
    if (newRow.description !== oldRow.description) {
        return `description from '${oldRow.description || ''}' to '${newRow.description || ''}'`;
    }
    if (newRow.isCustom !== oldRow.isCustom) {
        return `isCustom from '${oldRow.isCustom || ''}' to '${newRow.isCustom || ''}'`;
    }
    if (newRow.customCategory !== oldRow.customCategory) {
        return `customCategory from '${oldRow.customCategory || ''}' to '${newRow.customCategory || ''}'`;
    }
    if (newRow.structSchema !== oldRow.structSchema) {
        return `structSchema from '${oldRow.structSchema || ''}' to '${newRow.structSchema || ''}'`;
    }
    if (newRow.structType !== oldRow.structType) {
        return `structType from '${oldRow.structType || ''}' to '${newRow.structType || ''}'`;
    }
    return null;
}

export default function BasicEditingGrid() {
    const [data, setData] = React.useState([])
    const mutateRow = useFakeMutation();
    const [promiseArguments, setPromiseArguments] = React.useState(null);
    const [snackbar, setSnackbar] = React.useState(null);
    const noButtonRef = React.useRef(null);
    const handleCloseSnackbar = () => setSnackbar(null);
    const handleDelete = (e) => {
        console.log(e)
        deleteRow(e)


        const needDelete = data.find(t => t.id === e.id);

        let result = data.filter(t => t.id !== needDelete.id)
        // // 

        setData(result)
        // console.log(needDelete)
        // return Promise.resolve(result);
    }
    React.useEffect(() => {
        fetch(`http://127.0.0.1:1880/kapitest`)
            .then(results => results.json())
            .then(data => {

                setData(data)

            });
    }, [])
    const processRowUpdate = React.useCallback(
        (newRow, oldRow) =>
            new Promise((resolve, reject) => {
                const mutation = computeMutation(newRow, oldRow);
                if (mutation) {
                    // Save the arguments to resolve or reject the promise later
                    setPromiseArguments({ resolve, reject, newRow, oldRow });
                } else {
                    resolve(oldRow); // Nothing was changed
                }
            }),
        [],
    );
    const handleNo = () => {
        const { oldRow, resolve } = promiseArguments;
        resolve(oldRow); // Resolve with the old row to not update the internal state
        setPromiseArguments(null);
    };

    const handleYes = async () => {
        const { newRow, oldRow, reject, resolve } = promiseArguments;

        try {
            // Make the HTTP request to save in the backend
            const response = await mutateRow(newRow);
            setSnackbar({ children: 'User successfully saved', severity: 'success' });
            resolve(response);
            setPromiseArguments(null);
        } catch (error) {
            setSnackbar({ children: "Name can't be empty", severity: 'error' });
            reject(oldRow);
            setPromiseArguments(null);
        }
    };
    const handleEntered = () => {
        // The `autoFocus` is not used because, if used, the same Enter that saves
        // the cell triggers "No". Instead, we manually focus the "No" button once
        // the dialog is fully open.
        // noButtonRef.current?.focus();
    };
    const renderConfirmDialog = () => {
        if (!promiseArguments) {
            return null;
        }

        const { newRow, oldRow } = promiseArguments;
        const mutation = computeMutation(newRow, oldRow);

        return (
            <Dialog
                maxWidth="xs"
                TransitionProps={{ onEntered: handleEntered }}
                open={!!promiseArguments}
            >
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent dividers>
                    {`Pressing 'Yes' will change ${mutation}.`}
                </DialogContent>
                <DialogActions>
                    <Button ref={noButtonRef} onClick={handleNo}>
                        No
                    </Button>
                    <Button onClick={handleYes}>Yes</Button>
                </DialogActions>
            </Dialog>
        );
    };


    const columns = [{ field: 'id', headerName: 'id', width: 180, flex: 1.5, editable: false },
    { field: 'url', headerName: 'URL', width: 180, flex: 1.5, editable: false },
    { field: 'method', headerName: 'Method', flex: 1, editable: false },
    { field: 'body', headerName: 'Body', flex: 1.5, editable: true },
    { field: 'response', headerName: 'Response', flex: 1.5, editable: true },
    { field: 'description', headerName: 'Description', flex: 1.5, editable: true },
    { field: 'isCustom', headerName: 'with Customize header', type: 'boolean', flex: 0.5, editable: true },
    { field: 'customCategory', headerName: 'Customize Category', flex: 1.5, editable: true },
    { field: 'structSchema', headerName: 'Structure Schema', flex: 1.5, editable: true },
    { field: 'structType', headerName: 'Structure Type', flex: 1.5, editable: true },
    { field: 'createdDate', headerName: 'Created Date', flex: 1.5, editable: false },
    {
        field: 'actions',
        type: 'actions',
        align: 'right',
        flex: 1,
        getActions: (params) => [

            <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleDelete(params.row)}
            />,
        ],
    },
    ];

    return (

        <div style={{ height: '83vh', width: '100%' }}>
            {renderConfirmDialog()}
            <DataGrid
                rows={data}
                columns={columns}
                processRowUpdate={processRowUpdate}

                experimentalFeatures={{ newEditingApi: true }}
            />
            {!!snackbar && (
                <Snackbar
                    open
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={6000}
                >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </div>
    );
}

