import React, {useEffect, useState} from 'react';
import TodoItem from '../TodoItem/TodoItem';
import Form from '../Form/Form';
import Modal from '../modals/Modal';
import './Todo.css'

function Todo() {

  let [things, setThings] = useState([
	{title: "Помыть посуду",
	 description: "Вымыть 2 кастрюли, скорвородку, собрать по комнатам чашки, вымыть плиту.",
	 isdone: true,
	 priority: 1,
	 id: 0 
	},
	 
	{title: "Постирать",
	 description: "Запустить стиральную машину.",
	 isdone: false,
	 priority: 2,
	 id: 1
	}, 
	{title: "Поучиться",
	 description: "Выучить побитовые операции и узнать об их предназначении, попрактиковаться, прочитать 10-15 страниц книги об алгоритмах и структурах данных.",
	 isdone: true,
	 priority: 2,
	 id: 2 
	}, 
	{title: "Поесть",
	 description: "Сварить грибной суп и пообедать.",
	 isdone: false,
	 priority: 3,
	 id: 3 
	}, 
	{title: "Покормить Мяту",
	 description: "Сварить Мяте мясо из морозильника.",
	 isdone: false,
	 priority: 3,
	 id: 4 
	}])

	function sorting(){
		setThings([...things.sort((x, y) => x.priority - y.priority).reverse()])
	}

	function createPost(newPost){
		setThings([...things, newPost])
	}

	function deletePost(post){
		setThings(things.filter(p => p.id !== post.id))
	}

	function done(id){
		for(let i = 0; i < things.length; i++){
			if(things[i].id === id){
				if(things[i].isdone === false){
					currentlyRunning(id, true)
				}
				setIsDone(i, true)
				}
			}
		}

	function setIsDone(index, isFromDone){
		if(isFromDone){
			setThings(()=> {
				let CopyUpdeteIsDone = things.slice()
				CopyUpdeteIsDone[index].isdone = !(CopyUpdeteIsDone[index].isdone)
				return CopyUpdeteIsDone
			})
		}
		else{
			setThings(()=> {
				let CopyUpdeteIsDone = things.slice()
				CopyUpdeteIsDone[index].isdone = true
				return CopyUpdeteIsDone
			})
		}
	}

	let [currentThings, setCurrentThings] = useState([])

	function currentlyRunning(id, isFromDone){

		 // Дело на которое кликнули
		let clickedThing = (things.filter(thing => thing.id === id))[0]

		// Если дело на которое кликнули выполнено то оно будет пропадать из списка выполняющихся
		if(clickedThing.isdone === true){
			setCurrentThings(currentThings.filter(thing => thing.id !== clickedThing.id))
		}
		else{

			// Если список "Выполняется" пуст, добавим первый элемент
			if (currentThings === [] && isFromDone !== true) {
					setCurrentThings([...currentThings, clickedThing])
			}

			// В ином случае делаем проверку, есть ли уже в списке элемент, на который кликнули
			else{
				let copy = false

				for(let i = 0; i < currentThings.length; i++){
					if (currentThings[i].title === clickedThing.title) copy = true
				}

				// Если есть, то убираем его из списка и отмечаем как выполненное
				if(copy || isFromDone){
					for(let j = 0; j < things.length; j++){
						if (clickedThing.id === things[j].id){
							if(isFromDone){
								setCurrentThings(currentThings.filter(thing => thing.id !== things[j].id))
							}
							else{
								setIsDone(j, false)
								setCurrentThings(currentThings.filter(thing => thing.id !== things[j].id))
							}
							
						}
					}
				
				}

				// Если нет, то просто добавляем его в список
				else{
					setCurrentThings([...currentThings, clickedThing])
				}
			
			}
		}

	}

  return (
    <div className='Todo'>
		<div className='Todo__block'>
			{ things.length === 0 
			 ? 
			<h2 className='noPosts'>Нет заданий</h2>
			 :
			things.sort((x, y) => y.priority - x.priority).map(thing => {
			return(
			<TodoItem 
			create = {createPost}
			key = {thing.id} 
			title = {thing.title} 
			description = {thing.description} 
			isdone = {thing.isdone} 
			done = {() => {done(thing.id)}}
			priority={thing.priority} 
			post={thing} 
			delete={deletePost}
			currentlyRunning={currentlyRunning}>
			</TodoItem>)})
			}
			
		</div>
		<Form current_things={currentThings} className="form" create={createPost} sort={sorting}></Form>
		<div>
			<Modal stle={`${(things.every(item => item.isdone === true) && things.length !== 0) ? 'show' : ''}`}></Modal>
		</div>
    </div>
  );
		}
		

export default Todo;
