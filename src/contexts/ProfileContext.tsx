import { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from 'next/router'

import { useAuth } from "@/hooks/useAuth"

import Profile from '@/model/ProfileMd'

type ProfileContextType = {
  // profile: Profile | undefined;
  // setPlan: (string) => void;

  // email: any | undefined;
  // setEmail: (string) => void;
  // userName: any | undefined;
  // setUserName: (string) => void;
  // role: any | undefined;
  // setRole: (string) => void;
  // docType: any | undefined;
  // setDocType: (string) => void;
  // docNum: any | undefined;
  // setDocNum: (string) => void;
  // firstName: any | undefined;
  // setFirstName: (string) => void;
  // lastName: any | undefined;
  // setLastName: (string) => void;
  // companyName: any | undefined;
  // setCompanyName: (string) => void;
  // state: any | undefined;
  // setState: (string) => void;
  // city: any | undefined;
  // setCity: (string) => void;
  // zipCode: any | undefined;
  // setZipCode: (string) => void;
  // streetNum: any | undefined;
  // setStreetNum: (string) => void;
  // plan: any | undefined;
  // setPlan: (string) => void;

  // saveProfile: () => void;
  // savePlan: (string) => void;

  saved: any | undefined;

}

type ProfileContextProviderProps = {
  children: ReactNode;
}

export const ProfileContext = createContext({} as ProfileContextType);

export function ProfileContextProvider(props: ProfileContextProviderProps) {
  const { user } = useAuth()

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [role, setRole] = useState('')
  const [docType, setDocType] = useState('')
  const [docNum, setDocNum] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [streetNum, setStreetNum] = useState('')
  const [plan, setPlan] = useState('')

  const [saved, setSaved] = useState(false)

  const [createdAt, setCreatedAt] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)

  async function getProfile() {
    if (user){
      if (!userName) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _id: user.id
          })
        };

        const response = await fetch('/api/model/profiles', requestOptions)

        const doc = await response.json()
        if (doc.success) {
          //setProfile(doc.message)
          setEmail(user.email),
          setUserName(doc.message.user_name),
          setRole(doc.message.role),
          setDocType(doc.message.doc_type),
          setDocNum(doc.message.doc_num),
          setFirstName(doc.message.first_name),
          setLastName(doc.message.last_name),
          setCompanyName(doc.message.company_name),
          setState(doc.message.state),
          setCity(doc.message.city),
          setZipCode(doc.message.zip_code),
          setStreetNum(doc.message.street_num),
          setPlan(doc.message.plan),
          setCreatedAt(doc.message.created_at)
        }
      }
    }
  }

  async function saveProfile() {
    if (user){
      //console.log(createdAt)
      if (!createdAt) {
        setCreatedAt(new Date())
        setUpdatedAt(null)
      } else {
        setUpdatedAt(new Date())
      }
      const profileUpdt = JSON.stringify({
        _id: user.id,
        email: user.email,
        user_name: userName,
        role: role,
        doc_type: docType,
        doc_num: docNum,
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        state: state,
        city: city,
        zip_code: zipCode,
        street_num: streetNum,
        plan: plan,
        created_at: createdAt,
        updated_at: updatedAt
      })

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: profileUpdt
      };

      const response = await fetch('/api/model/profiles', requestOptions)

      const doc = await response.json()
      //console.log(doc.success)
      if (doc.success) {
        setSaved(true)
      } else {
        setSaved(false)
        console.log('Falha ao tentar salvar cadastro.');
      }
    } else {
      router.push('/signin')
    }
  }

  async function savePlan(newPlan: string) {
    if (user){
      if (newPlan != plan) {
        const profileUpdt = JSON.stringify({
          _id: user.id,
          email: user.email,
          plan: newPlan,
          updated_at: new Date()
        })

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: profileUpdt
        };

        const response = await fetch('/api/model/profiles', requestOptions)

        const doc = await response.json()
        //console.log(doc.success)
        if (doc.success) {
          if (plan != plan) {
            alert(`Plano atualizado para ${plan} com sucesso!`);

            router.push('/home')
          } else if (!plan) {
            alert(`Plano ${plan} assinado com sucesso!`);
            router.push('/home')
          }
        }
      } else {
        alert(`${plan} é o seu plano atual!`);
      }
    } else {
      router.push('/signin')
    }
  }

  return (
    <ProfileContext.Provider value={{
      // email, setEmail,
      // userName, setUserName,
      // role, setRole,
      // docType, setDocType,
      // docNum, setDocNum,
      // firstName, setFirstName,
      // lastName, setLastName,
      // companyName, setCompanyName,
      // state, setState,
      // city, setCity,
      // zipCode, setZipCode,
      // streetNum, setStreetNum,
      // plan, setPlan,
      // saveProfile,
      // savePlan,
      saved
    }}>
      {props.children}
    </ProfileContext.Provider>
  );
}
