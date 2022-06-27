import { createContext, ReactNode, useEffect, useState } from "react";
import makesDB from "@/services/makes.json"
import statesDB from "@/services/states.json"

import VersionMd from '@/model/VersionMd'

type Model = {
  id: number
  name: string
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

type FilterContextType = {
  valueMake: any | undefined;
  setValueMake: (any) => void;
  inputValueMake: any | undefined;
  setInputValueMake: (any) => void;
  valueModel: any | undefined;
  setValueModel: (any) => void;
  inputValueModel: any | undefined;
  setInputValueModel: (any) => void;
  valueYear: any | undefined;
  setValueYear: (any) => void;
  inputValueYear: any | undefined;
  setInputValueYear: (any) => void;
  valueVersion: any | undefined;
  setValueVersion: (any) => void;
  inputValueVersion: any | undefined;
  setInputValueVersion: (any) => void;

  versionMd: VersionMd | undefined;



  priceClass: any | undefined;
  setPriceClass: (any) => void;

  fVisiteds: any | undefined;
  setFvisiteds: (any) => void;

  originData: any | undefined;
  setOriginData: (any) => void;


  states: OptionString[] | undefined;
  cities: Option[] | undefined;
  makes: Option[] | undefined;
  models: Option[] | undefined;
  years: Option[] | undefined;
  versions: Option[] | undefined;


  //optional filter
  valueState: any | undefined;
  setValueState: (any) => void;
  inputValueState: any | undefined;
  setInputValueState: (any) => void;

  valueCity: any | undefined;
  setValueCity: (any) => void;
  inputValueCity: any | undefined;
  setInputValueCity: (any) => void;

  priceGt: any | undefined;
  priceLt: any | undefined;
  setPriceGt: (any) => void;
  setPriceLt: (any) => void;

  fipePrcntGt: any | undefined;
  fipePrcntLt: any | undefined;
  setFipePrcntGt: (any) => void;
  setFipePrcntLt: (any) => void;
  //optional filter


  //sort optional
  sortOrder: any | undefined;
  setSortOrder: (any) => void;
  sortYear: any | undefined;
  setSortYear: (any) => void;
  sortPrice: any | undefined;
  setSortPrice: (any) => void;
  sortFipePrcnt: any | undefined;
  setSortFipePrcnt: (any) => void;
  //sort optional


  clearRoleAll: () => void;
  clearRoleMake: () => void;
  clearRoleModel: () => void;
  clearRoleYear: () => void;

  showMenu;
  setShowMenu;
}

type FilterContextProviderProps = {
  children: ReactNode;
}


export const FilterContext = createContext({} as FilterContextType);

export function FilterContextProvider(props: FilterContextProviderProps) {
  const [valueMake, setValueMake] = useState('');
  const [inputValueMake, setInputValueMake] = useState('');
  const [valueModel, setValueModel] = useState('');
  const [inputValueModel, setInputValueModel] = useState('');
  const [valueYear, setValueYear] = useState('');
  const [inputValueYear, setInputValueYear] = useState('');
  const [valueVersion, setValueVersion] = useState('');
  const [inputValueVersion, setInputValueVersion] = useState('');

  const [versionsMd, setVersionsMd] = useState<VersionMd[]>([])
  const [versionMd, setVersionMd] = useState<VersionMd>()

  const [valueState, setValueState] = useState('');
  const [inputValueState, setInputValueState] = useState('');

  const [valueCity, setValueCity] = useState('');
  const [inputValueCity, setInputValueCity] = useState('');

  const [models, setModels] = useState<Option[]>([])
  const [years, setYears] = useState([])
  const [versions, setVersions] = useState([])

  const [cities, setCities] = useState<Option[]>([])

  const [priceClass, setPriceClass] = useState('')
  const [fVisiteds, setFvisiteds] = useState('0')

  const [originData, setOriginData] = useState('')

  const [priceGt, setPriceGt] = useState(0)
  const [priceLt, setPriceLt] = useState(0)

  const [fipePrcntGt, setFipePrcntGt] = useState(0)
  const [fipePrcntLt, setFipePrcntLt] = useState(0)

  const [sortOrder, setSortOrder] = useState('');
  const [sortYear, setSortYear] = useState(0)
  const [sortPrice, setSortPrice] = useState(0)
  const [sortFipePrcnt, setSortFipePrcnt] = useState(0)

  const [showMenu, setShowMenu] = useState("hidden");

  const makes = makesDB
  const states = statesDB

  useEffect(() => {
    const valueMakeStorage = localStorage.getItem('valueMake')
    const inputValueMakeStorage = localStorage.getItem('inputValueMake')

    if (valueMakeStorage != valueMake) {
      setValueMake(valueMakeStorage)
      setInputValueMake(inputValueMakeStorage)
    }
  }, []);

  useEffect(() => {
    const valueModelStorage = localStorage.getItem('valueModel')
    const inputValueModelStorage = localStorage.getItem('inputValueModel')

    if (valueModelStorage != valueModel) {
      setValueModel(valueModelStorage)
      setInputValueModel(inputValueModelStorage)
    }
  }, []);

  useEffect(() => {
    const valueYearStorage = localStorage.getItem('valueYear')
    const inputValueYearStorage = localStorage.getItem('inputValueYear')

    if (valueYearStorage != valueYear) {
      setValueYear(valueYearStorage)
      setInputValueYear(inputValueYearStorage)
    }
  }, []);

  useEffect(() => {
    const valueVersionStorage = localStorage.getItem('valueVersion')
    const inputValueVersionStorage = localStorage.getItem('inputValueVersion')

    if (valueVersionStorage != valueVersion) {
      setValueVersion(valueVersionStorage)
      setInputValueVersion(inputValueVersionStorage)
    }
  }, []);

  useEffect(() => {
    const versionMdStorage = localStorage.getItem('versionMd')

    if (versionMdStorage && JSON.parse(versionMdStorage)?.fipeId !== versionMd?.fipeId) {
      setVersionMd(JSON.parse(versionMdStorage))
    }
  }, []);

  useEffect(() => {
    const valueStateStorage = localStorage.getItem('valueState')
    const inputValueStateStorage = localStorage.getItem('inputValueState')

    if (valueStateStorage != valueState) {
      setValueState(valueStateStorage)
      setInputValueState(inputValueStateStorage)
    }
  }, []);

  useEffect(() => {
    const valueCityStorage = localStorage.getItem('valueCity')
    const inputValueCityStorage = localStorage.getItem('inputValueCity')

    if (valueCityStorage != valueCity) {
      setValueCity(valueCityStorage)
      setInputValueCity(inputValueCityStorage)
    }
  }, []);

  useEffect(() => {
    const priceClassStorage = localStorage.getItem('priceClass')

    if (priceClassStorage != priceClass) {
      setPriceClass(priceClassStorage)
    }
  }, []);

  useEffect(() => {
    const fVisitedsStorage = localStorage.getItem('fVisiteds')

    if (fVisitedsStorage != fVisiteds) {
      setFvisiteds(fVisitedsStorage)
    }
  }, []);

  useEffect (() => {
    async function getModels(){
      let url = `https://api.mobiauto.com.br/search/api/vehicle/v1.0/CAR/models/id/${inputValueMake}?inProduction=false`
      let headers = {
        'host': 'www.mobiauto.com.br',
        'referer': 'https://www.mobiauto.com.br/tabela-fipe',
        'cache-control': 'no-cache'
      }

      let data = await fetch(url, { headers })
      let mdls: Model[] = await data.json()

      if (mdls) {
        let options: Option[] = []
        for(let i = 0; i < mdls.length; i = i + 1) {
          let option = {} as Option
          option.label = mdls[i].name
          option.id = mdls[i].id

          options.push(option)
        }
        setModels(options)
      }
    }

    if (valueMake != '' && valueMake != null && valueMake != undefined) {
      getModels()
    }
  }, [valueMake])

  useEffect (() => {
    async function getYears(){
      let url = `https://api.mobiauto.com.br/search/api/vehicle/v1.0/CAR/years/id/${inputValueModel}?inProduction=false`
      let headers = {
        'host': 'www.mobiauto.com.br',
        'referer': 'https://www.mobiauto.com.br/tabela-fipe',
        'cache-control': 'no-cache'
      }

      let data = await fetch(url, { headers })
      let yrs = await data.json()

      let options: Option[] = []
      for(let i = 0; i < yrs.years.length; i = i + 1) {
        let option = {} as Option
        option.label = yrs.years[i].toString()
        option.id = yrs.years[i]

        options.push(option)
      }
      setYears(options)
    }

    if (valueModel != '' && valueModel != null && valueModel != undefined) {
      getYears()
    }
  }, [valueModel])

  useEffect (() => {
    async function getVersions(){
      let url = `https://api.mobiauto.com.br/search/api/vehicle/v1.0/CAR/trims/id/${inputValueModel}/${inputValueYear}`
      let headers = {
        'host': 'www.mobiauto.com.br',
        'referer': 'https://www.mobiauto.com.br/tabela-fipe',
        'cache-control': 'no-cache'
      }

      let data = await fetch(url, { headers })
      let vrs: VersionMd[] = await data.json()
      setVersionsMd(vrs)

      let options: Option[] = []
      for(let i = 0; i < vrs.length; i = i + 1) {
        let option = {} as Option
        option.label = vrs[i].name
        option.id = vrs[i].fipeId

        options.push(option)
      }
      setVersions(options)
    }

    if (valueYear != '' && valueYear != null && valueYear != undefined) {
      getVersions()
    }
  }, [valueYear])

  useEffect (() => {
    if (valueVersion != '' && valueVersion != null && valueVersion != undefined && versionsMd.length > 0) {
       setVersionMd(versionsMd.find(vrs => vrs.fipeId == inputValueVersion))

       localStorage.setItem('versionMd', JSON.stringify(versionsMd.find(vrs => vrs.fipeId == inputValueVersion)))
    }
  }, [valueVersion])

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


  useEffect (() => {
    if (sortOrder == "1") {
      setSortPrice(0)
      setSortFipePrcnt(0)

      setSortYear(1)
    }
    if (sortOrder == "-1") {
      setSortPrice(0)
      setSortFipePrcnt(0)

      setSortYear(-1)
    }
    if (sortOrder == "2") {
      setSortYear(0)
      setSortFipePrcnt(0)

      setSortPrice(1)
    }
    if (sortOrder == "-2") {
      setSortYear(0)
      setSortFipePrcnt(0)

      setSortPrice(-1)
    }
    if (sortOrder == "3") {
      setSortYear(0)
      setSortPrice(0)

      setSortFipePrcnt(1)
    }
    if (sortOrder == "-3") {
      setSortYear(0)
      setSortPrice(0)

      setSortFipePrcnt(-1)
    }
  }, [sortOrder])

  function clearRoleAll() {
    setValueMake('')
    setInputValueMake('')
    localStorage.setItem('valueMake', '')
    localStorage.setItem('inputValueMake', '')

    setValueModel('')
    setInputValueModel('')
    localStorage.setItem('valueModel', '')
    localStorage.setItem('inputValueModel', '')

    setValueYear('')
    setInputValueYear('')
    localStorage.setItem('valueYear', '')
    localStorage.setItem('inputValueYear', '')

    setValueVersion('')
    setInputValueVersion('')
    localStorage.setItem('valueVersion', '')
    localStorage.setItem('inputValueVersion', '')

    setVersionMd(null)
    localStorage.setItem('versionMd', '')
  }

  function clearRoleMake() {
    setValueModel('')
    setInputValueModel('')
    localStorage.setItem('valueModel', '')
    localStorage.setItem('inputValueModel', '')

    setValueYear('')
    setInputValueYear('')
    localStorage.setItem('valueYear', '')
    localStorage.setItem('inputValueYear', '')

    setValueVersion('')
    setInputValueVersion('')
    localStorage.setItem('valueVersion', '')
    localStorage.setItem('inputValueVersion', '')

    setVersionMd(null)
    localStorage.setItem('versionMd', '')
  }

  function clearRoleModel() {
    setValueYear('')
    setInputValueYear('')
    localStorage.setItem('valueYear', '')
    localStorage.setItem('inputValueYear', '')

    setValueVersion('')
    setInputValueVersion('')
    localStorage.setItem('valueVersion', '')
    localStorage.setItem('inputValueVersion', '')

    setVersionMd(null)
    localStorage.setItem('versionMd', '')
  }

  function clearRoleYear() {
    setValueVersion('')
    setInputValueVersion('')
    localStorage.setItem('valueVersion', '')
    localStorage.setItem('inputValueVersion', '')

    setVersionMd(null)
    localStorage.setItem('versionMd', '')
  }

  return (
    <FilterContext.Provider value={{
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

      versionMd,

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

      sortOrder,
      setSortOrder,
      sortYear,
      setSortYear,
      sortPrice,
      setSortPrice,
      sortFipePrcnt,
      setSortFipePrcnt,



      states,
      cities,
      makes,
      models,
      years,
      versions,
      clearRoleAll,
      clearRoleMake,
      clearRoleModel,
      clearRoleYear,

      showMenu, setShowMenu
    }}>
      {props.children}
    </FilterContext.Provider>
  );
}
