import React, { useState } from 'react'
import { Form } from '@unform/web'
import { v4 as uuidv4 } from 'uuid'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'

import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import Input from './components/Input/index'
import "./styles.css"

const App = () => {
  const [inputFields, setInputFields] = useState([
    { id: uuidv4(), a: '', alpha: '', d: '', theta: ''},
  ])
  const [result, setResult] = useState([])
  const [coordX, setCoordX] = useState()
  const [coordY, setCoordY] = useState()
  const [coordZ, setCoordZ] = useState()

  const fetchCalculate = async (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
    fetch('https://denavit-hartenberg.herokuapp.com/calculate-dh/', requestOptions)
      .then(async response => {
        const data = await response.json()
        
        if (!response.ok) {
          const error = (data && data.message) || response.status
          return Promise.reject(error)
        }

        setResult(data.result)
        setCoordX(parseFloat(data.coord.x).toFixed(4))
        setCoordY(parseFloat(data.coord.y).toFixed(4))
        setCoordZ(parseFloat(data.coord.z).toFixed(4))
      })
      .catch(error => {
        store.addNotification({
          title: "Erro!",
          message: "Dados inválidos, tente novamente.",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: true,
            pauseOnHover: true,
          }
        })
      })
  }

  const handleFormSubmit = async (data) => {
    let dataArray = []
    
    inputFields.forEach(e => {
      dataArray.push({
        a: data[`a-${e.id}`],
        alpha: data[`alpha-${e.id}`],
        d: data[`d-${e.id}`],
        theta: data[`theta-${e.id}`],
      })
    })
    
    await fetchCalculate(dataArray)
  }

  const handleAddFields = () => {
    setInputFields([
      ...inputFields, { id: uuidv4(), a: '', alpha: '', d: '', theta: ''}
    ])
  }

  const handleRemoveFields = id => {
    const values  = [...inputFields]
    values.splice(values.findIndex(value => value.id === id), 1)
    setInputFields(values)
  }

  const handleClean = () => {
    setResult([])
    setCoordX(undefined)
    setCoordY(undefined)
    setCoordZ(undefined)
    setInputFields([
      { id: uuidv4(), a: '', alpha: '', d: '', theta: ''}, 
    ])
  }

  return (
    <div className="main-app">
      <ReactNotification />
      
      <div className="title-content">
        <h1 className="title">Denavit-Hartenberg</h1>
      </div>

      { result.length !== 0 ?
        <div className="table-content">
          <div className="subtitle-content">
            <h2 className="subtitle">Resultado:</h2>
          </div>
          
          <TableContainer className="table-container">
            <Table sx={{ minWidth: 300 }} aria-label="simple table">
              <TableBody>
                { result.map((row, i) => (
                  <TableRow key={i}>
                    { row.map((col, i) => (
                      <TableCell key={i} align="center">{parseFloat(col).toFixed(4)}</TableCell>
                    )) }
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </TableContainer>
        </div> : null }
        
      { coordX && coordY && coordZ ?
        <div className="result-content">
          <span className="result">X: { coordX }</span>
          <span className="result">Y: { coordY }</span>
          <span className="result">Z: { coordZ }</span>
        </div> : null }

      { result.length !== 0 ? <hr className="horizontal-line" /> : null }

      <Form onSubmit={handleFormSubmit}>
        { inputFields.map((inputField, i) => (
          <div key={inputField.id} className="input-content">
            <div className="label-content"><label className="input-label">{`A${i}`}</label></div>
            <Input name={`a-${inputField.id}`} required={true} placeholder={`Insira o valor 'A${i}'`} />

            <div className="label-content"><label className="input-label">{`α${i}`}</label></div>
            <Input name={`alpha-${inputField.id}`} required={true} placeholder={`Insira o valor 'α${i}'`} />

            <div className="label-content"><label className="input-label">{`D${i}`}</label></div>
            <Input name={`d-${inputField.id}`} required={true} placeholder={`Insira o valor 'D${i}'`} />

            <div className="label-content"><label className="input-label">{`θ${i}`}</label></div>
            <Input name={`theta-${inputField.id}`} required={true} placeholder={`Insira o valor 'θ${i}'`} />
            
            <button type="button" className="input-button remove-button" onClick={() => handleRemoveFields(inputField.id)}>-</button>
            <button type="button" className="input-button add-button" onClick={handleAddFields}>+</button>
          </div>
        )) }
        <button type="submit">Calcular</button>
        <button type="button" className="clean-button" onClick={handleClean}>Limpar</button>
      </Form>
    </div>
  )
}

export default App
