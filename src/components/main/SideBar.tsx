import { useEffect, useState } from "react"
import { useFilter } from '@/hooks/useFilter'
import { useCard } from '@/hooks/useCard'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
//import NumberFormat from 'react-number-format';

import { SelectChangeEvent } from '@mui/material/Select';

interface NewValue {
  label: string
  id: number
}

export default function SideBar() {
  const {
    valueMake,
    setValueMake,
    inputValueMake,
    setInputValueMake,
    valueModel,
    setValueModel,
    inputValueModel,
    setInputValueModel,
    valueYear,
    setValueYear,
    inputValueYear,
    setInputValueYear,
    valueVersion,
    setValueVersion,
    inputValueVersion,
    setInputValueVersion,

    valueState,
    setValueState,
    inputValueState,
    setInputValueState,

    valueCity,
    setValueCity,
    inputValueCity,
    setInputValueCity,

    priceClass,
    setPriceClass,

    fVisiteds,
    setFvisiteds,

    originData,
    setOriginData,

    priceGt,
    priceLt,
    setPriceGt,
    setPriceLt,

    fipePrcntGt,
    fipePrcntLt,
    setFipePrcntGt,
    setFipePrcntLt,

    states,
    cities,
    makes,
    models,
    years,
    versions,
    clearRoleMake,
    clearRoleModel,
    clearRoleYear,

    showMenu, setShowMenu
  } = useFilter()
  const { getCardsData, getCardsDataDb } = useCard()


  const [requiredField, setRequiredField] = useState(null);

  function handleGetLocal() {
    (showMenu === "hidden") ? setShowMenu("block") : setShowMenu("hidden")
    getCardsDataDb()
    setRequiredField(false)
  }

  function handleGetWeb() {
    if (!valueMake || !valueModel || !valueYear || !valueVersion) {
      setRequiredField(true)
      alert("Preencher campos em vermelho!")
    } else {
      (showMenu === "hidden") ? setShowMenu("block") : setShowMenu("hidden")

      getCardsData()
      setRequiredField(false)
    }
  }

  useEffect(() => {
    setFipePrcntGt(0)
    setFipePrcntLt(0)
    setOriginData('')
    getCardsDataDb()
  }, [priceClass]);

  useEffect(() => {
    getCardsDataDb()
  }, [fVisiteds]);

  // useEffect(() => {
  //   if (requiredField) {
  //     getCardsData()
  //   }
  // }, [requiredField]);

  // useEffect (() => {
  //   setSortFipePrcnt(0)
  // }, [sortPrice])

  // useEffect (() => {
  //   setSortPrice(0)
  // }, [sortFipePrcnt])

  return (
    <div className="mt-3 px-4">
       {/* <MainFilter /> */}
      <div className="grid grid-col-1 items-center justify-center px-10 md:max-w-3xl border-gray-900">
        <button onClick={() => (fVisiteds !== '1') ? setFvisiteds('1') : setFvisiteds('0')} className={(fVisiteds === '1') ? `bg-red-600 border-2 text-white font-bold text-2xl w-full px-5 py-1 rounded-3xl` : ` bg-gray-100 font-bold text-2xl hover:bg-gray-300 border-2 text-gray-500 w-full px-5 py-1 rounded-3xl`}>Visitei</button>
        {/* <button onClick={() => setPriceClass('')} className={(priceClass == '') ? `bg-black border-2 text-white px-5 py-1 rounded-3xl` : ` bg-gray-100 hover:bg-gray-300 border-2 text-gray-500 px-5 py-1 rounded-3xl`}>Todos</button>
        <div className="flex items-center justify-center pt-4">
          <button onClick={() => setPriceClass('Excelente')} className={(priceClass == 'Excelente') ? `bg-green-400 border-2 text-white px-5 py-1 rounded-l-3xl` : ` bg-gray-100 hover:bg-gray-300 border-2 text-gray-500 px-5 py-1 rounded-l-3xl`}>Excelente</button>
          <button onClick={() => setPriceClass('Bom')} className={(priceClass == 'Bom') ? `bg-yellow-400 border-2 text-white px-5 py-1` : ` bg-gray-100 hover:bg-gray-300 border-2 text-gray-500 px-5 py-1`}>Bom</button>
          <button onClick={() => setPriceClass('Justo')} className={(priceClass == 'Justo') ? `bg-red-500 border-2 text-white px-5 py-1` : ` bg-gray-100 hover:bg-gray-300 border-2 text-gray-500 px-5 py-1`}>Justo</button>
          <button onClick={() => setPriceClass('Alto')} className={(priceClass == 'Alto') ? `bg-gray-600 border-2 text-white px-5 py-1 rounded-r-3xl` : ` bg-gray-100 hover:bg-gray-300 border-2 text-gray-500 px-5 py-1 rounded-r-3xl`}>Alto</button>
        </div> */}
      </div>

      {/* <div className="flex items-center justify-center pt-4">
        <button className="bg-yellow-500 border-2 text-white px-5 py-1 rounded-3xl">Carro</button>
        <button className="bg-gray-100 hover:bg-gray-300 border-2 text-gray-500 px-5 py-1">Moto</button>
        <button className="bg-gray-100 hover:bg-gray-300 border-2 text-gray-500 px-5 py-1 rounded-r-3xl">Caminhão</button>
      </div> */}
      <div className="grid grid-col-1 items-center justify-center gap-4 px-10 py-5 md:max-w-3xl sm:mx-auto">


        <div className="border-2 border-purple-500 rounded-lg py-3 divide-y divide-indigo-600 px-2">
          <div className="flex items-center justify-center font-bold text-2xl">
            <p>Buscar</p>
          </div>
          <div className="grid grid-col-1 items-center justify-center gap-4 pt-3">

            <div className={(requiredField && !valueMake) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
              <Autocomplete
                id="combo-box-valueMake"
                value={valueMake}
                onChange={(event, newValue: NewValue | "") => {
                  clearRoleMake()
                  if (newValue != "" && newValue != undefined) {
                    setValueMake(newValue?.label);
                    setInputValueMake(newValue?.id);
                    localStorage.setItem('valueMake', newValue?.label)
                    localStorage.setItem('inputValueMake', newValue?.id.toString())
                  }
                  else {
                    setValueMake('');
                    setInputValueMake('');
                    localStorage.setItem('valueMake', '')
                    localStorage.setItem('inputValueMake', '')
                  }
                }}
                isOptionEqualToValue={(option, value) => value?.value === option.value}
                disablePortal
                options={makes}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Marca" />}
              />
            </div>

            <div className={(requiredField && !valueModel) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
              <Autocomplete
                id="combo-box-valueModel"
                value={valueModel}
                onChange={(event, newValue: NewValue | "") => {
                  clearRoleModel()
                  if (newValue != "" && newValue != undefined) {
                    setValueModel(newValue.label);
                    setInputValueModel(newValue.id);
                    localStorage.setItem('valueModel', newValue.label)
                    localStorage.setItem('inputValueModel', newValue.id.toString())
                  }
                  else {
                    setValueModel('');
                    setInputValueModel('');
                    localStorage.setItem('valueModel', '')
                    localStorage.setItem('inputValueModel', '')
                  }
                }}
                isOptionEqualToValue={(option, value) => value.value === option.value}
                disablePortal
                options={models}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Modelo" />}
              />
            </div>

            <div className={(requiredField && !valueYear) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
              <Autocomplete
                id="combo-box-valueYear"
                value={valueYear}
                onChange={(event, newValue: NewValue | "") => {
                  clearRoleYear()
                  if (newValue != "" && newValue != undefined) {
                    setValueYear(newValue.label);
                    setInputValueYear(newValue.id);
                    localStorage.setItem('valueYear', newValue.label)
                    localStorage.setItem('inputValueYear', newValue.id.toString())
                  }
                  else {
                    setValueYear('');
                    setInputValueYear('');
                    localStorage.setItem('valueYear', '')
                    localStorage.setItem('inputValueYear', '')
                  }
                }}
                isOptionEqualToValue={(option, value) => value.value === option.value}
                disablePortal
                options={years}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Ano" />}
              />
            </div>

            <div className={(requiredField && !valueVersion) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
              <Autocomplete
                id="combo-box-valueVersion"
                value={valueVersion}
                onChange={(event, newValue: NewValue | "") => {
                  if (newValue != "" && newValue != undefined) {
                    setValueVersion(newValue.label);
                    setInputValueVersion(newValue.id);
                    localStorage.setItem('valueVersion', newValue.label)
                    localStorage.setItem('inputValueVersion', newValue.id.toString())
                  }
                  else {
                    setValueVersion('');
                    setInputValueVersion('');
                    localStorage.setItem('valueVersion', '')
                    localStorage.setItem('inputValueVersion', '')
                    localStorage.setItem('versionMd', '')
                  }
                }}
                isOptionEqualToValue={(option, value) => value.value === option.value}
                disablePortal
                options={versions}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Versão" />}
              />
            </div>

            <Autocomplete
              id="combo-box-valueState"
              value={valueState}
              onChange={(event, newValue: NewValue | "") => {
                if (newValue != "" && newValue != undefined) {
                  setValueState(newValue.label);
                  setInputValueState(newValue.id);
                  localStorage.setItem('valueState', newValue.label)
                  localStorage.setItem('inputValueState', newValue.id.toString())
                }
                else {
                  setValueState('');
                  setInputValueState('');
                  localStorage.setItem('valueState', '')
                  localStorage.setItem('inputValueState', '')
                }
              }}
              isOptionEqualToValue={(option, value) => value.value === option.value}
              disablePortal
              options={states}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Estado" />}
            />

            <div className="flex items-center justify-center mt-2">
              <button onClick={() => handleGetLocal()} className="bg-blue-400 hover:bg-blue-300 border-2 border-gray-300 text-white font-bold w-4/5 py-2 rounded-md">Salvos</button>
              <button onClick={() => handleGetWeb()} className="bg-yellow-400 hover:bg-yellow-300 border-2 border-gray-300 text-white font-bold w-4/5 py-2 rounded-md">Novos</button>
            </div>
          </div>
        </div>


        <div className="border-2 border-purple-500 rounded-lg py-3 divide-y divide-indigo-600 px-2">
          <div className="flex items-center justify-center font-bold text-2xl">
            <p>Filtrar</p>
          </div>
          <div className="grid grid-col-1 items-center justify-center gap-4 pt-3">

            <Autocomplete
              id="combo-box-valueState2"
              value={valueState}
              onChange={(event, newValue: NewValue | "") => {
                if (newValue != "" && newValue != undefined) {
                  setValueState(newValue.label);
                  setInputValueState(newValue.id);
                  localStorage.setItem('valueState', newValue.label)
                  localStorage.setItem('inputValueState', newValue.id.toString())
                }
                else {
                  setValueState('');
                  setInputValueState('');
                  localStorage.setItem('valueState', '')
                  localStorage.setItem('inputValueState', '')
                }
              }}
              isOptionEqualToValue={(option, value) => value.value === option.value}
              disablePortal
              options={states}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Estado" />}
            />

            <Autocomplete
              id="combo-box-valueCity"
              value={valueCity}
              onChange={(event, newValue: NewValue | "") => {
                if (newValue != "" && newValue != undefined) {
                  setValueCity(newValue.label);
                  setInputValueCity(newValue.id);
                  localStorage.setItem('valueCity', newValue.label)
                  localStorage.setItem('inputValueCity', newValue.id.toString())
                }
                else {
                  setValueCity('');
                  setInputValueCity('');
                  localStorage.setItem('valueCity', '')
                  localStorage.setItem('inputValueCity', '')
                }
              }}
              isOptionEqualToValue={(option, value) => value.value === option.value}
              disablePortal
              options={cities}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Cidade" />}
            />

            <div className="flex w-full gap-2">
              <TextField
                id="priceGt"
                type="number"
                value = {priceGt}
                label="Valor Min."
                variant="outlined"
                onChange={(e) => setPriceGt(parseFloat(e.target.value))}
              />

              <TextField
                id="priceLt"
                type="number"
                value = {priceLt}
                label="Valor Max."
                variant="outlined"
                onChange={(e) => setPriceLt(parseFloat(e.target.value))}
              />
            </div>

            <div className="flex w-full gap-2">
              <TextField
                id="fipePrcntGt"
                type="number"
                value = {fipePrcntGt}
                label="% Min. Fipe"
                variant="outlined"
                onChange={(e) => setFipePrcntGt(parseFloat(e.target.value))}
              />

              <TextField
                id="fipePrcntLt"
                type="number"
                value = {fipePrcntLt}
                label="% Max. Fipe"
                variant="outlined"
                onChange={(e) => setFipePrcntLt(parseFloat(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-center mt-2">
              <button onClick={() => handleGetLocal()} className="bg-blue-400 hover:bg-blue-300 border-2 border-gray-300 text-white font-bold w-4/5 py-2 rounded-md">Filtrar</button>
            </div>
          </div>
        </div>

      </div>

      {/* <MainFilter /> */}
    </div>
  )
}
