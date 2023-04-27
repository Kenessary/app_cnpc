import { Text, View, TextInput, Dimensions, ScrollView, KeyboardAvoidingView, TouchableOpacity, Modal, Alert, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { AntDesign, Ionicons } from '@expo/vector-icons'; 
import { AuthContext } from '../../context/AuthContext'
import moment from 'moment';
import qs from "qs"
import axios from "axios"
import { FontAwesome } from '@expo/vector-icons'; 




// import DateTimePickerModal from "react-native-modal-datetime-picker";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ],
  monthNamesShort: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  dayNames: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: "Сегодня"
};

export default function FoodMenuPanel({navigation}) {
  const {iin} = useContext(AuthContext)
  const date = moment().format(`YYYY-MM-DD`)

  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [menuStatus, setMenuStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [ob, setOb] = useState('');
  // const [oab, setOab] = useState('');
  const [inputs, setInputs] = useState(
    {
      salat1: '', 
      salat2: ', ', 
      perv1: '', 
      perv2: '', 
      sec1: '', 
      sec2: '',
      gar1: '', 
      gar2: '',
      vyp: '',
    })

  const handleOnChange = (text, input) => {
    setInputs(prevState=>({...prevState, [input]: text}))
}


const foodAdd = () => {
  setIsLoading(true)
  const data = qs.stringify({
    'dobavleniemenuiin': iin,
    'dobavleniemenumenu': ob,
    'dobavleniemenudate': selectedDate
  });
  const config = {
    method: 'post',
    url: 'http://95.57.218.120/?index',
    headers: { 
      'Authorization': 'Basic OTgwNjI0MzUxNDc2OjIyMjI=', 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  axios(config)
  .then(async function(response){
    if (selectedDate === ''){
      Alert.alert('Выберите дату')
  }
      let user = response.data.replace(/<[^>]*>/g, '').replace(/-->/g, '')
      let parsed = JSON.parse(user)
      setMenuStatus(parsed.status) 
      setIsLoading(false) 
  })

  .catch(function(error){
      console.log(error)
      setIsLoading(false)
  }) 
}

// console.log(selectedDate)




const addMenuList = () => {
  const salat = `Салат: ${inputs.salat1}, ${inputs.salat2}. ; `
  const pervoe = `Первое блюдо: ${inputs.perv1}, ${inputs.perv2}. ; `
  const vtoroe = `Второе блюдо: ${inputs.sec1}, ${inputs.sec2}. ; `
  // const garnir = `Гарнир: ${inputs.gar1}, ${inputs.gar2}. ; `
  const garnir = `Гарнир: `
  const vyp = ` Выпечка: ${inputs.vyp}. ;`
  if(inputs.gar1 !== '' && inputs.gar2 === '' && inputs.vyp !== ''){
    setOb(salat+pervoe+vtoroe+garnir+`${inputs.gar1}. ;`+vyp)
  }
  ///гар2 вып1
  if(inputs.gar1 === '' && inputs.gar2 !== '' && inputs.vyp !== ''){
    setOb(salat+pervoe+vtoroe+garnir+`${inputs.gar2}. ;`+vyp)
  }
  ///гар1
  if(inputs.gar1 !== '' && inputs.gar2 === '' && inputs.vyp === ''){
    setOb(salat+pervoe+vtoroe+garnir+`${inputs.gar1}. ;`)
  }
  ///гар2
  if(inputs.gar1 === '' && inputs.gar2 !== '' && inputs.vyp === ''){
    setOb(salat+pervoe+vtoroe+garnir+`${inputs.gar2}. ;`)
  }
   ///гар1 гар2 вып1
  if(inputs.gar1 !== '' && inputs.gar2 !== ''&& inputs.vyp !== ''){
    setOb(salat+pervoe+vtoroe+garnir+`${inputs.gar1}, `+`${inputs.gar2}. ;`+vyp)
  }
  ///гар1 гар2
  if(inputs.gar1 !== '' && inputs.gar2 !== ''&& inputs.vyp === ''){
    setOb(salat+pervoe+vtoroe+garnir+`${inputs.gar1}, `+`${inputs.gar2}. ;`)
  }
  ///
  if(inputs.gar1 === '' && inputs.gar2 === ''&& inputs.vyp === ''){
    setOb(salat+pervoe+vtoroe)
  }
  if(inputs.gar1 === '' && inputs.gar2 === ''&& inputs.vyp !== ''){
    setOb(salat+pervoe+vtoroe+vyp)
  }
}

useEffect(()=>{
  addMenuList()
})

useEffect(()=>{
  if(menuStatus !== ''){
    setModalVisible1(true)
  }
})

// console.log(ob)




 
    return (
      <ScrollView style={{height:'100%', backgroundColor: 'white' , opacity: modalVisible || modalVisible1 ? 0.1 : 1}} automaticallyAdjustKeyboardInsets={true} StickyHeaderComponent>
<View style={{alignItems:'center', marginTop:10}} >
      <View style={{width:windowWidth-20, flexDirection:'row', justifyContent:'space-around'}}>
        <TouchableOpacity style={{width:"45%", height:30, borderWidth:3, borderColor:'#D64D43', alignItems:'center', justifyContent:'center', borderRadius:10}} onPress = {() => {navigation.navigate('MenuHistory')}}>
          <Text style={{color:'#D64D43', fontWeight:'600'}}>История меню</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width:"45%", height:30,borderWidth:3, borderColor:'#D64D43', alignItems:'center', justifyContent:'center', borderRadius:10,}} onPress = {() => {navigation.navigate('MenuStatistics')}}>
          <Text style={{color:'#D64D43', fontWeight:'600'}}>Статистика опроса</Text>
        </TouchableOpacity>
      </View>

</View>
              

      <View style={{ alignItems:'center', marginTop:20}}>
        {/* <Text style={{fontSize:17, fontWeight:'600', marginBottom:10,marginTop:15, color:'#4d4d4d'}}>Выберите дату:</Text> */}
        <TouchableOpacity 
          style={{width:windowWidth-130, height:40, backgroundColor:'#B9B9B9', borderRadius:15, alignItems:'center', justifyContent:'center', flexDirection:'row'}}
          onPress={()=>setModalVisible(true)}
          >
          <AntDesign name="calendar" size={20} color="white" />
          <Text 
            style={{fontSize:16, fontWeight:'500', color:"white", marginLeft:10}}>
              Выберите дату
            </Text>
        </TouchableOpacity>

<Text style={{fontSize:17, fontWeight:'600', marginBottom:10,marginTop:15, color:'#4d4d4d'}}>Введите меню:</Text>


  
      </View>
      {/* <TextInput style={{width: 200, height:40, borderWidth:0.5, borderColor:'#4d4d4d', borderRadius:15, fontSize:16}}/> */}
      <View style={{alignItems:'center'}}>
    <View style={{ width: windowWidth-20, padding:15, borderRadius:5, borderWidth:0.5, marginTop:5}}>
      <View style={{flexDirection:'row', alignItems:'center', marginBottom:10}}>
        <View style={{width: 90, marginRight: 5}}>
      <Text style={{fontSize:14, fontWeight:'500', color:'#4d4d4d',}}>Салат №1:</Text>

        </View>
        <TextInput 
        style={{width: 200, height:30, borderRadius:15, fontSize:14, backgroundColor:'white', borderWidth:0.5, borderColor:'grey', paddingLeft:10, paddingRight:10}}
        onChangeText={(text)=>handleOnChange(text, 'salat1')}
        />

      </View>

      <View style={{flexDirection:'row', alignItems:'center'}}>
        <View style={{width: 90, marginRight: 5}}>
      <Text style={{fontSize:14, fontWeight:'500', color:'#4d4d4d',}}>Салат №2:</Text>

        </View>
    <TextInput style={{width: 200, height:30, borderRadius:15, fontSize:14, backgroundColor:'white', borderWidth:0.5, borderColor:'grey', paddingLeft:10, paddingRight:10}}
     onChangeText={(text)=>handleOnChange(text, 'salat2')}
    />

      </View>

      <View style={{width:'100%', height:0.5, backgroundColor:'grey', marginTop:10, marginBottom:10}}></View>



      <View style={{flexDirection:'row', alignItems:'center', marginBottom:10}}>
        <View style={{width: 90, marginRight: 5}}>
      <Text style={{fontSize:14, fontWeight:'500', color:'#4d4d4d',}}>Первое блюдо №1:</Text>

        </View>
        <TextInput style={{width: 200, height:30, borderRadius:15, fontSize:14, backgroundColor:'white', borderWidth:0.5, borderColor:'grey', paddingLeft:10, paddingRight:10}}
        onChangeText={(text)=>handleOnChange(text, 'perv1')}
        />

      </View>

      <View style={{flexDirection:'row', alignItems:'center'}}>
        <View style={{width: 90, marginRight: 5}}>
      <Text style={{fontSize:14, fontWeight:'500', color:'#4d4d4d',}}>Первое блюдо №2:</Text>

        </View>
    <TextInput style={{width: 200, height:30, borderRadius:15, fontSize:14, backgroundColor:'white', borderWidth:0.5, borderColor:'grey', paddingLeft:10, paddingRight:10}}
    onChangeText={(text)=>handleOnChange(text, 'perv2')}
    />

      </View>

      <View style={{width:'100%', height:0.5, backgroundColor:'grey', marginTop:10, marginBottom:10}}></View>


      
      <View style={{flexDirection:'row', alignItems:'center', marginBottom:10}}>
        <View style={{width: 90, marginRight: 5}}>
      <Text style={{fontSize:14, fontWeight:'500', color:'#4d4d4d',}}>Второе блюдо №1:</Text>

        </View>
        <TextInput style={{width: 200, height:30, borderRadius:15, fontSize:14, backgroundColor:'white', borderWidth:0.5, borderColor:'grey', paddingLeft:10, paddingRight:10}}
        onChangeText={(text)=>handleOnChange(text, 'sec1')}
        />

      </View>


      
      
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <View style={{width: 90, marginRight: 5}}>
      <Text style={{fontSize:14, fontWeight:'500', color:'#4d4d4d',}}>Второе блюдо №2:</Text>

        </View>
        <TextInput style={{width: 200, height:30, borderRadius:15, fontSize:14, backgroundColor:'white', borderWidth:0.5, borderColor:'grey', paddingLeft:10, paddingRight:10}}
        onChangeText={(text)=>handleOnChange(text, 'sec2')}
        />

      </View>

      <View style={{width:'100%', height:0.5, backgroundColor:'grey', marginTop:10, marginBottom:10}}></View>


      
      {/* <KeyboardAvoidingView> */}
      <View style={{flexDirection:'row', alignItems:'center', marginBottom:10}}>
        <View style={{width: 90, marginRight: 5}}>
      <Text style={{fontSize:14, fontWeight:'500', color:'#4d4d4d',}}>Гарнир №1:</Text>

        </View>
        <TextInput style={{width: 200, height:30, borderRadius:15, fontSize:14, backgroundColor:'white', borderWidth:0.5, borderColor:'grey', paddingLeft:10, paddingRight:10}}
        onChangeText={(text)=>handleOnChange(text, 'gar1')}
        />

      </View>
        
      {/* </KeyboardAvoidingView> */}
      


      
      
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <View style={{width: 90, marginRight: 5}}>
      <Text style={{fontSize:14, fontWeight:'500', color:'#4d4d4d',}}>Гарнир №2:</Text>

        </View>
        <TextInput style={{width: 200, height:30, borderRadius:15, fontSize:14, backgroundColor:'white', borderWidth:0.5, borderColor:'grey', paddingLeft:10, paddingRight:10}}
        onChangeText={(text)=>handleOnChange(text, 'gar2')}
        />

      </View>

      <View style={{width:'100%', height:0.5, backgroundColor:'grey', marginTop:10, marginBottom:10}}></View>



      
      
      <View style={{flexDirection:'row', alignItems:'center', marginBottom:10}}>
        <View style={{width: 90, marginRight: 5}}>
      <Text style={{fontSize:14, fontWeight:'500', color:'#4d4d4d',}}>Выпечка:</Text>

        </View>
        <TextInput style={{width: 200, height:30, borderRadius:15, fontSize:14, backgroundColor:'white', borderWidth:0.5, borderColor:'grey', paddingLeft:10, paddingRight:10}}
        onChangeText={(text)=>handleOnChange(text, 'vyp')}
        />

      </View>

      <View style={{alignItems:'center'}}>
      <TouchableOpacity style={{width: windowWidth-80, height: 50, backgroundColor:'#D64D43', alignItems:'center', justifyContent:'center', borderRadius:15, flexDirection:'row' }} onPress = {() => foodAdd()}  >
      {isLoading === true ? <ActivityIndicator size="small" color="white" style={{ marginRight:10}} />:<></> }
        <Text style={{color:'white', fontSize:17, fontWeight:'600'}}>Добавить</Text>
      </TouchableOpacity>
      </View>


      
 

 

      

      
    </View>
    <View style={{marginBottom:40}}></View>

      </View>

      <Modal 
            animationType="fade"
            transparent={true}
            visible={modalVisible}
        >
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <View style={{width:windowWidth-20, backgroundColor:'white', alignItems:'center', padding:15, borderRadius:15, shadowColor:"#000", shadowOffset:{height:2}, shadowOpacity:0.2, shadowRadius:9, elevation:4}}>
<Calendar
      onDayPress={(day) => {setSelectedDate(day.dateString)}}
      markedDates={{
        [selectedDate]: {selected: true}
      }}
      // shouldRasterizeIOS={true}
      style={{width:windowWidth-40, borderRadius: 5, borderColor:"#4d4d4d"}}
      theme={{textDayFontWeight:'500', selectedDayTextColor:'white', selectedDayBackgroundColor:'#D64D43', todayTextColor:'#D64D43', textMonthFontWeight:'600', arrowColor:'#D64D43'}}
    />

    <TouchableOpacity style={{width:windowWidth-200, height:40, backgroundColor:'#D64D43', marginTop: 10, alignItems:'center', justifyContent:'center', borderRadius:15}} onPress={()=>setModalVisible(false)}>
      <Text style={{fontSize:16, fontWeight:'500', color:'white'}}>
        OK
      </Text>

    </TouchableOpacity>

          </View>

          </View>


        </Modal>

        <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible1}
        >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <FontAwesome name="check-circle" size={130} color="#57CF2D" />
                        <View style={{flexDirection:'column', alignItems:'center'}}>
                          <Text style={{fontSize:16, fontWeight:'600', marginBottom:10, marginTop:10, color:'#57CF2D'}}>{menuStatus}</Text>

                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {setModalVisible1(!modalVisible1); setMenuStatus(''); navigation.navigate('MenuHistory')}}
                        >
                            <Text style={styles.textStyle}>Проверить история меню</Text>
                        </Pressable>

                        </View>
                    </View>
                    </View>
          </Modal>


      </ScrollView>
    )
}

LocaleConfig.defaultLocale = 'ru';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: windowWidth-50,
    height: 250,
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 4
  },
  button: {
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "white",
    borderColor:'#D64D43',
    borderWidth: 2
  },
  textStyle: {
    color: "#D64D43",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 18
  }

})
