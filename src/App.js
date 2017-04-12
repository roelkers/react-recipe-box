import React from 'react';
import './App.css';
import {
  Accordion,
  Panel,
  Button,
  ButtonToolbar,
  ListGroup,
  ListGroupItem,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';

const ingredientsOfRecipe = (props) => props.ingredients.map((ingredient)=>{return <ListGroupItem>{ingredient}</ListGroupItem>});

class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.handleRecipeEdit = this.handleRecipeEdit.bind(this);
  }
  handleRecipeEdit(){
    this.props.openModal(this.props.index)
  }
  render() {
    const ingredients = ingredientsOfRecipe(this.props.recipe);
    return (
      <div>
          <h4 className="text-center">Ingredients</h4>
          <ListGroup>
          {ingredients}
          </ListGroup>
          <ButtonToolbar>
            <Button className="" onClick={this.handleRecipeEdit}>Edit</Button>
            <Button bsStyle="danger" onClick={this.props.delete}>Delete</Button>
          </ButtonToolbar>
        </div>
    );
  }
}

class RecipeModal extends React.Component{
  constructor(props){
    super(props);
  }
  render() {
    if(this.props.showModal === false)
      return null;
    const buttonSaveEdit = <Button bsStyle="primary" onClick={this.props.saveRecipe}>Save</Button>;
    const buttonAddNew = <Button bsStyle="primary" onClick={this.props.addRecipe}>Add</Button>;
    return (
      <div>
        <Modal show={true} onHide={this.props.close}>
          <Modal.Header closeButton>
            <Modal.Title>New Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
            <FormGroup validationState={this.props.titleValidationState}>
              <ControlLabel>Title</ControlLabel>
              <FormControl onChange={this.props.handleTitleChange} value={this.props.titleInput} type="text" placeholder="Enter the recipe title." />
            </FormGroup >
            <FormGroup validationState={this.props.ingValidationState}>
              <ControlLabel>Ingredients</ControlLabel>
              <FormControl onChange={this.props.handleIngChange} value={this.props.ingredientsInput} componentClass="textarea" placeholder="Enter ingredients separated by commas." />
            </FormGroup>
           </form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button onClick={this.props.close}>Close</Button>
              {
                this.props.showModal === "new" ?
                  buttonAddNew :
                  buttonSaveEdit
              }
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </div>);
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state =  {
      activeKey : null,
      titleValidationState : null,
      ingValidationState : null,
      titleInput: "",
      ingredientsInput : "",
      showModal : false,
      recipes: JSON.parse(localStorage.getItem("_roelkers_recipes")) || [{
        name: "Spaghetti Carbonara",
        ingredients: ["Spaghetti", "Eggs", "Bacon", "Parmesan Cheese"]
      }, {
        name: "Hamburger",
        ingredients: ["Beef", "Hamburger Buns", "Salad", "Sauce", "Ketchup", "Gherkins"]
      }, {
        name: "Caesar Salad",
        ingredients: ["Raddicchio", "Mustard", "Yoghurt", "Chicken Strips", "Tomato"]
      }]
    }
    this.closeModal = this.closeModal.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
    this.handleIngChange = this.handleIngChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.openModal = this.openModal.bind(this);
    this.saveRecipe = this.saveRecipe.bind(this);
  }
  handleTitleChange(event){
    this.setState({titleInput : event.target.value});
  }
  handleIngChange(event){
    this.setState({ingredientsInput : event.target.value});
  }
  closeModal() {
    this.setState(
      { showModal: false,
        titleValidationState : null,
        ingValidationState : null
                  });
  }
  openModal(recipe) {
    if(recipe === "new")
      this.setState({
        showModal: recipe,
        titleInput : "",
        ingredientsInput : ""
      });
    else
      this.setState({
        showModal : recipe,
        titleInput : this.state.recipes[recipe].name,
        ingredientsInput : this.state.recipes[recipe].ingredients.join(",")
      })
  }
  handleSelect(activeKey) {
    this.setState({ activeKey });
  }
  addRecipe() {
    //check if title field empty
    if(this.state.titleInput===""){
      this.setState({titleValidationState : "error"})
      return;
    }
    //check if recipe with that name is already defined
    const found = this.state.recipes.find((recipe)=>recipe.name===this.state.titleInput);
    if(found){
      this.setState({titleValidationState : "error"})
      return;
    }
    const ingredients = this.state.ingredientsInput.split(",");
    const recipe = {
      name : this.state.titleInput,
      ingredients : ingredients
    };
    const recipes = this.state.recipes;
    recipes.push(recipe);
    this.setState({
      recipes : recipes
    });
    localStorage.setItem("_roelkers_recipes", JSON.stringify(recipes));
    this.closeModal();
  }
  saveRecipe(){
    if(this.state.titleInput===""){
      this.setState({titleValidationState : "error"})
      return;
    }
     //check if recipe with that name is already defined
    const found = this.state.recipes.find((recipe)=>recipe.name===this.state.titleInput);
    const ingredients = this.state.ingredientsInput.split(",");
    const recipe = {
      name : this.state.titleInput,
      ingredients : ingredients
    };
    const recipes = this.state.recipes;
    recipes[this.state.activeKey] = recipe;
    this.setState({
      recipes : recipes
    });
    localStorage.setItem("_roelkers_recipes",JSON.stringify(recipes));
    this.closeModal();
  }
  deleteRecipe(){
    let i = -1;
    const recipes = this.state.recipes.filter((recipe) => {
         i++;
         return i !== this.state.activeKey;
      }
    );
    this.setState({ recipes : recipes});
    localStorage.setItem("_roelkers_recipes",JSON.stringify(recipes));
  }
  render() {
    let renderedRecipes = this.state.recipes.map((rec, index) =>
      <Panel header={rec.name} eventKey={index}>
        <Recipe recipe={rec}
                delete={this.deleteRecipe}
                openModal={this.openModal}
                closeModal={this.closeModal}
                index={index}
          /></Panel>);
    return (
      <div className="container">
        <div className="row">
          <h1 className="text-center">Recipe Box</h1>
        </div>
        <div className="row">
            <Panel className="acc">
            <Accordion className=" col-xs-12" onSelect={this.handleSelect} activeKey={this.state.activeKey}>
              {renderedRecipes}
            </Accordion>
            </Panel>
        </div>
        <div className="row">
          <Button bsStyle="primary" onClick={this.openModal.bind(this,"new")}>Add Recipe</Button>
        </div>
        <RecipeModal close={this.closeModal} open={this.openModal}  showModal={this.state.showModal}
          ingredientsInput={this.state.ingredientsInput} titleInput={this.state.titleInput} handleTitleChange={this.handleTitleChange} handleIngChange={this.handleIngChange} addRecipe={this.addRecipe} saveRecipe={this.saveRecipe}
          titleValidationState={this.titleValidationState} ingValidationState={this.ingValidationState}
        />
     </div>
    );
  }
};

export default App;
