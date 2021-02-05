import React, {useEffect, useState} from "react";
import "./App.css";
import {Button, Container} from "@material-ui/core";
import {ColDef, DataGrid, SelectionChangeParams, StateChangeParams} from "@material-ui/data-grid";
import {Map} from "./components/Map";
import {getUsers, postUsers, showError} from "./api/api";


type GeoType = {
    lat: number
    lng: number
}

export type ResponsePropsType = {
    id: number
    username: string
    phone: string
    address: {
        zipcode: number
        geo: GeoType
    }
}

function App() {

    const [users, setUsers] = useState<ResponsePropsType[]>([])
    const [sentArr, setSentArr] = useState<ResponsePropsType[]>([])
    const [unchecked, setUnchecked] = useState<boolean>(false)

    const sentHandler = () => {
        const body = JSON
            .stringify(sentArr.map(u => {
                return [{"id": `<${u.id}>`, "zipcode": `<${u.address.zipcode}>`}]
            }))

        postUsers(body, "posts")
            .then((res: Response) => {
                    if (res.status === 200) {
                        setUnchecked(true)
                        console.log(body)
                    } else {
                        showError(res.status, "some error!")
                        return
                    }
                }
            )
    }

    const selectHandler = (newSelection: SelectionChangeParams) => {
        const Arr = newSelection.rowIds.map((id) => {
            return users[+id - 1]
        })
        setSentArr([...Arr])
    }

    const gridStateChangeHandler = (e: StateChangeParams) => {
        if (unchecked) {
            e.state.selection = {}
            setUnchecked(false)
        }
    }

    useEffect(() => {
        getUsers("users")
            .then((res: Response) => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    showError(res.status, "some error!")
                    return
                }
            })
            .then((json: ResponsePropsType[]) => {
                const response = json.map((i: ResponsePropsType) => {
                    return {
                        id: i.id,
                        address: {
                            zipcode: i.address.zipcode,
                            geo: i.address.geo
                        },
                        username: i.username,
                        phone: i.phone
                    }
                })
                setUsers([...response])
            })
    }, [])

    const columns: ColDef[] = [
        {field: "id", headerName: "ID", width: 90},
        {field: "userName", headerName: "userName", width: 130},
        {field: "phone", headerName: "phone", width: 220},
    ];

    return (
        <>
            <div className='App'>
                {users
                    ? <div className='grid'>
                        <DataGrid
                            rows={users.map(u => {
                                return {id: u.id, userName: u.username, phone: u.phone}
                            })}
                            columns={columns}
                            pagination={undefined}
                            autoPageSize
                            autoHeight={true}
                            checkboxSelection
                            onStateChange={(e: StateChangeParams) => gridStateChangeHandler(e)}
                            hideFooterPagination
                            onSelectionChange={selectHandler}
                        />
                    </div>
                    : null}

                <div className='grid'>
                    <Map users={sentArr}/>
                </div>
            </div>
            <Container className='button'>
                <Button
                    variant='outlined'
                    onClick={sentHandler}
                >Загрузить</Button>
            </Container>
        </>

    );
}

export default App;
