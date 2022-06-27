import { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { firebase, auth } from '@/services/firebase'

type User = {
  id: string;
  email: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => void;



  //PROFILE
  email: any | undefined;
  setEmail: (string) => void;
  phone: any | undefined;
  setPhone: (string) => void;
  userName: any | undefined;
  setUserName: (string) => void;
  role: any | undefined;
  setRole: (string) => void;
  docType: any | undefined;
  setDocType: (string) => void;
  docNum: any | undefined;
  setDocNum: (string) => void;
  firstName: any | undefined;
  setFirstName: (string) => void;
  lastName: any | undefined;
  setLastName: (string) => void;
  companyName: any | undefined;
  setCompanyName: (string) => void;
  state: any | undefined;
  setState: (string) => void;
  city: any | undefined;
  setCity: (string) => void;
  zipCode: any | undefined;
  setZipCode: (string) => void;
  streetNum: any | undefined;
  setStreetNum: (string) => void;
  complement: any | undefined;
  setComplement: (string) => void;
  plan: any | undefined;
  setPlan: (string) => void;

  saveProfile:() => Promise<void>;
  savePlan: (string) => void;
  //PROFILE
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  const router = useRouter()


  //PROFILE
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
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
  const [complement, setComplement] = useState('')
  const [plan, setPlan] = useState('')


  const [createdAt, setCreatedAt] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  //PROFILE


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { email, uid } = user

        if (!email) {
          throw new Error('Missing information from Google Account');
        }

        setUser({
          id: uid,
          email: email
        })

        getProfile(uid, email)
      }

      // else {
      //   router.push('/signin')
      // }
    })

    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { email, uid } = result.user

      if (!email) {
        throw new Error('Missing information from Google Account');
      }

      setUser({
        id: uid,
        email: email
      })

      getProfile(uid, email)
    }
  }

  async function signUpWithEmail(email: string, password: string){
    if (!email) {
      alert('Campo e-mail é obrigatório!')
    }

    if (!password) {
      alert('Campo senha é obrigatório!')
    }

    if (email && password) {
      if (email != password) {
        auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const { email, uid } = userCredential.user
          router.push('/signin')
        })
        .catch((error) => {
          alert(error.message)
        });
      } else {
        alert('Senha deve ser diferente do e-mail!')
      }
    }
  }

  async function signInWithEmail(email: string, password: string) {
    if (!email) {
      alert('Campo e-mail é obrigatório!')
    }

    if (!password) {
      alert('Campo senha é obrigatório!')
    }

    if (email && password) {
      auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const { email, uid } = userCredential.user

        if (!uid) {
          throw new Error('Missing information from Google Account');
        }

        setUser({
          id: uid,
          email: email
        })

        getProfile(uid, email)

      })
      .catch((error) => {
        alert(error.message)
      });
    }
  }

  function signOut(){
    auth.signOut().then(() => {
      setUser(null)
      clearProfile()
    })
  }


  //PROFILE
  function clearProfile() {
    setEmail('')
    setPhone('')
    setUserName('')
    setRole('')
    setDocType('')
    setDocNum('')
    setFirstName('')
    setLastName('')
    setCompanyName('')
    setState('')
    setCity('')
    setZipCode('')
    setStreetNum('')
    setComplement('')
    setPlan('')
    setCreatedAt('')
  }

  async function getProfile(userId, userEmail) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: userId
      })
    };

    const response = await fetch('/api/model/profiles', requestOptions)

    const doc = await response.json()

    if (doc.success) {
      //setProfile(doc.message)
      setEmail(userEmail),
      setPhone(doc.message.phone),
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
      setComplement(doc.message.complement),
      setPlan(doc.message.plan),
      setCreatedAt(doc.message.created_at)

      if (router.asPath == '/signin') {
        router.push('/home')
      }
    } else {
      router.push('/profile')
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
        phone: phone,
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
        complement: complement,
        plan: plan,
        created_at: createdAt,
        updated_at: updatedAt
      })

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: profileUpdt
      };

      // const response = await fetch('/api/model/profiles', requestOptions)

      // const doc = await response.json()

      // if (doc.success) {
      //   setSaved(true)
      // } else {
      //   setSaved(false)
      //   console.log('Falha ao tentar salvar cadastro.');
      // }

      fetch('/api/model/profiles', requestOptions)
      .then(function(response) {
        return response.json();
      })
      .then(function(doc) {
        if (doc.success) {
          router.push('/home')
          alert("Cadastro salvo com sucesso!")
        } else {
          alert("Falha ao tentar salvar o cadastro!")
        }
      });

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
  //PROFILE

  return (
    <AuthContext.Provider value={{
      user, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut,

      //PROFILE
      email, setEmail,
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
      plan, setPlan,
      saveProfile,
      savePlan
      //PROFILE

      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
