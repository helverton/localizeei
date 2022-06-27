import { useRouter } from 'next/router'
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useAuth } from '../hooks/useAuth';

import { useFilter } from '@/hooks/useFilter'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import statesDB from "@/services/states.json"

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Root from "@/components/main/Root";
import SideBar from "@/components/main/SideBar";
import { FaBell, FaUserAlt, FaPowerOff, FaHome } from "react-icons/fa";
import { FiBarChart2 } from "react-icons/fi";

import InputMask from 'react-input-mask';

interface NewValue {
  label: string
  id: string
}

type City = {
  id: number
  nome: string
}

type Option = {
  label: string
  id: any
}

type OptionString = {
  label: string
  id: string
}

export default function Profile() {
  const {
    user,

    email,
    phone, setPhone,
    userName, setUserName,
    role, setRole,
    docType, setDocType,
    docNum, setDocNum,
    firstName, setFirstName,
    lastName, setLastName,
    companyName, setCompanyName,
    state, setState,
    city, setCity,
    zipCode, setZipCode,
    streetNum, setStreetNum,
    complement, setComplement,
    plan,
    setPlan,
    saveProfile,
    signOut
  } = useAuth()

  const router = useRouter()

  const [cities, setCities] = useState<Option[]>([])

  const [valueState, setValueState] = useState('');
  const [inputValueState, setInputValueState] = useState('');

  const [valueCity, setValueCity] = useState('');
  const [inputValueCity, setInputValueCity] = useState('');

  const [requiredField, setRequiredField] = useState(null);


  const states = statesDB

  function handleSave() {
    if (!userName || !role || !docType || !docNum || (docType == 'CPF' && (!firstName || !lastName)) || (docType == 'CNPJ' && !companyName) || !state || !city || !zipCode || !streetNum) {
      setRequiredField(true)
      alert("Preencher campos em vermelho!")
    } else {
      saveProfile()
    }
  }

  function clearAll() {
    setValueState('')
    setInputValueState('')
    setState('')

    setValueCity('')
    setInputValueCity('')
    setCity('')
  }

  const handleSelectRole = (event: SelectChangeEvent) => {
    setRole(event.target.value)
  };

  const handleSelectDocType = (event: SelectChangeEvent) => {
    setDocType(event.target.value)
  };

  function handleSignOut() {
    router.push('/')
    signOut()
  }

  useEffect (() => {
    async function getCities(){
      let url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${inputValueState}/regioes-imediatas`

      let data = await fetch(url)
      let cts: City[] = await data.json()

      let options: Option[] = []
      for(let i = 0; i < cts.length; i = i + 1) {
        let option = {} as Option
        option.label = cts[i].nome
        option.id = cts[i].id

        options.push(option)
      }
      setCities(options)
    }

    if (valueState != '' && valueState != null && valueState != undefined) {
      getCities()
    }
  }, [valueState])

  // useEffect (() => {
  //   function handleVerifyPlan(){
  //     if (!user) {
  //       router.push('/signin')
  //     }
  //   }

  //   handleVerifyPlan()
  // }, [user])

  return (
    <div className="h-full">
      <div className="flex w-full">



        <div className="flex flex-col w-full">
          <div className="flex pl-4 pr-4 border-b-2 border-light-blue-700 border-opacity-25 shadow-2xl bg-gray-800 sticky top-0 w-full h-16">
            <div className="block">
              <div className="flex bg-white rounded-full w-16 h-16 mt-2 items-center justify-center">
                <Link href="/">
                  <a>
                    <img className="rounded-full w-14 h-14" src="/localizeei.jpg" />
                  </a>
                </Link>
              </div>
            </div>

            <div className="flex h-16 w-full">
              {/* <div className="flex items-center justify-center w-full">
                <div className="hidden md:block">
                  <div className="flex bg-white rounded-full w-16 h-16 mt-2 items-center justify-center">
                    <Link href="/">
                      <a>
                        <img className="rounded-full w-14 h-14" src="/localizeei.jpg" />
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="block sm:hidden">
                  <div className="flex bg-white rounded-full w-16 h-16 mt-2 items-center justify-center">
                    <Link href="/">
                      <a>
                        <img className="rounded-full w-14 h-14" src="/localizeei.jpg" />
                      </a>
                    </Link>
                  </div>
                </div>
              </div> */}

              <div className="flex items-center justify-center w-full">
                <div className="flex ml-auto rounded-md mt-2">
                  <span className="text-2xl text-red-500 font-bold italic">{userName}</span>
                </div>
                <div className="w-10 h-10 rounded-full shadow-lg">
                  <div onClick={() => handleSignOut()} className="flex rounded-md hover:bg-gray-600 mr-auto mt-2 items-center justify-center w-10 h-10 text-white">
                    <FaUserAlt className="w-6 h-6" />
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full shadow-lg">
                  <div onClick={() => handleSignOut()} className="flex rounded-md hover:bg-gray-600 mr-auto mt-2 items-center justify-center w-10 h-10 text-white">
                    <FaPowerOff className="w-6 h-6" />
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full shadow-lg">
                  <div onClick={() => router.push('/home')} className="flex rounded-md hover:bg-gray-600 mr-auto mt-2 items-center justify-center w-10 h-10 text-white">
                    <FaHome className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="transform h-screen">
            <div className="p-5">
              {/* {props.children} */}
              <div className="py-3 divide-y divide-indigo-600 px-2">
                <div className="flex items-center justify-center font-bold text-2xl">
                  <p>Perfil</p>
                </div>
                <div className="grid grid-col-1 items-center justify-center gap-4 pt-3">

                  <TextField id="outlined-basic" sx={{ width: 300 }}  className="bg-gray-200" label="E-mail usuário" value={(user) ? user.email : ' '}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />

                  <div className={(requiredField && !userName) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
                    <TextField id="outlined-basic" sx={{ width: 300 }} label="Nome usuário" value={userName}
                      onChange={event => {
                        setUserName(event.target.value);
                      }}
                    variant="outlined" />
                  </div>

                  <div className={(requiredField && !phone) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
                    <InputMask
                      mask="(99) 9 9999-9999"
                      value={phone}
                      onChange={event => {
                        setPhone(event.target.value);
                      }}
                    >
                      {() => <TextField sx={{ width: 300 }} label="Telefone" variant="outlined"/>}
                    </InputMask>
                  </div>

                  <div className={(requiredField && !role) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
                    <FormControl sx={{ width: 300 }}>
                      <InputLabel id="order-select">Perfil</InputLabel>
                      <Select
                        labelId="option-select"
                        id="simple-option-select"
                        value={role}
                        onChange={handleSelectRole}
                        autoWidth
                        label="Perfil"
                      >
                        <MenuItem sx={{ width: 280 }} value="">
                          <em>----</em>
                        </MenuItem>
                        <MenuItem value={'Loja'}>Loja</MenuItem>
                        <MenuItem value={'Vendedor'}>Vendedor</MenuItem>
                        <MenuItem value={'Cliente'}>Cliente</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className={(requiredField && !docType) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
                    <FormControl sx={{ width: 300 }}>
                      <InputLabel id="order-select">Documento</InputLabel>
                      <Select
                        labelId="option-select"
                        id="simple-option-select"
                        value={docType}
                        onChange={handleSelectDocType}
                        autoWidth
                        label="Tipo de documento"
                      >
                        <MenuItem sx={{ width: 280 }} value="">
                          <em>----</em>
                        </MenuItem>
                        <MenuItem value={'CNPJ'}>CNPJ</MenuItem>
                        <MenuItem value={'CPF'}>CPF</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className={(requiredField && !docNum) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
                    <InputMask
                      mask={(docType == 'CNPJ') ? "99.999.999/9999-99" : "999.999.999-99"}
                      value={docNum}
                      onChange={event => {
                        setDocNum(event.target.value);
                      }}
                    >
                      {() => <TextField sx={{ width: 300 }} label={`Número ` + docType} variant="outlined"/>}
                    </InputMask>
                  </div>

                  <div className={((requiredField && !firstName) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : "") + ((docType == 'CNPJ') ? " hidden" : " block")}>
                    <TextField id="outlined-basic" sx={{ width: 300 }} label='Primeiro nome' value={firstName}
                      onChange={event => {
                        setFirstName(event.target.value);
                      }}
                    variant="outlined" />
                  </div>

                  <div className={((requiredField && !lastName) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : "") + ((docType == 'CNPJ') ? " hidden" : " block")}>
                    <TextField id="outlined-basic" sx={{ width: 300 }} label='Último nome' value={lastName}
                      onChange={event => {
                        setLastName(event.target.value);
                      }}
                    variant="outlined" />
                  </div>

                  <div className={((requiredField && !companyName) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : "") + ((docType == 'CPF') ? " hidden" : " block")}>
                    <TextField id="outlined-basic" sx={{ width: 300 }} label='Nome empresa' value={companyName}
                      onChange={event => {
                        setCompanyName(event.target.value);
                      }}
                    variant="outlined" />
                  </div>

                  <div className={(requiredField && !state) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
                    <Autocomplete
                      id="combo-box-valueState2"
                      value={(state) ? states.find(x => x.id == state).label : ''}
                      onChange={(event, newValue: NewValue | "") => {
                        clearAll()
                        if (newValue != "" && newValue != undefined) {
                          setValueState(newValue.label);
                          setInputValueState(newValue.id);
                          setState(newValue.id);
                        }
                        else {
                          setValueState('');
                          setInputValueState('');
                          setState('');
                        }
                      }}
                      //isOptionEqualToValue={(option, value) => value.state === option.value}
                      disablePortal
                      options={states}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Estado" />}
                    />
                  </div>

                  <div className={(requiredField && !city) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
                    <Autocomplete
                      id="combo-box-valueCity"
                      value={city}
                      onChange={(event, newValue: NewValue | "") => {
                        if (newValue != "" && newValue != undefined) {
                          setValueCity(newValue.label);
                          setInputValueCity(newValue.id);
                          setCity(newValue.label);
                        }
                        else {
                          setValueCity('');
                          setInputValueCity('');
                          setCity('');
                        }
                      }}
                      isOptionEqualToValue={(option, value) => value.value === option.value}
                      disablePortal
                      options={cities}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Cidade" />}
                    />
                  </div>

                  <div className={(requiredField && !zipCode) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
                    <InputMask
                      mask="99999-999"
                      value={zipCode}
                      onChange={event => {
                        setZipCode(event.target.value);
                      }}
                    >
                      {() => <TextField sx={{ width: 300 }} label='CEP' variant="outlined"/>}
                    </InputMask>
                  </div>

                  <div className={(requiredField && !streetNum) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
                    <TextField id="outlined-basic" sx={{ width: 300 }} label='N° Rua' value={streetNum}
                      onChange={event => {
                        setStreetNum(event.target.value);
                      }}
                    variant="outlined" />
                  </div>

                  <div className={(requiredField && !complement) ? "border-l-2 border-b-2 border-red-600 rounded-lg" : ""}>
                    <TextField id="outlined-basic" sx={{ width: 300 }} label='Complemento' value={complement}
                      onChange={event => {
                        setComplement(event.target.value);
                      }}
                    variant="outlined" />
                  </div>

                  <div className="flex items-center justify-center mt-2">
                    <button onClick={() => handleSave()} className="bg-green-400 hover:bg-green-300 border-2 border-gray-300 text-white font-bold w-4/5 py-2 rounded-md">Salvar</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
