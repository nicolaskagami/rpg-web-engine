var ACCESS_OPTION_NAME = "ACCESS";

function showLoginPopup()
{
	hideLoginConfigurationErrorBlock();
	var loginErrorAlert = document.getElementById("loginErrorAlert");	
	loginErrorAlert.style= "display:none";
	$('#loginModal').modal('show');
}

function submitLoginPopup()
{
	var usernameLineEdit = document.getElementById("username");	
	var passwordLineEdit = document.getElementById("password");
	
	validateLogin(usernameLineEdit.value,passwordLineEdit.value)
}

function wrongLogin()
{
	var loginErrorAlert = document.getElementById("loginErrorAlert");	
	loginErrorAlert.style= "display:block";
}

function showUsersInformation(user_info)
{
	var loginButton = document.getElementById("loginButton");	
	loginButton.style= "display:none";
	var userTab = document.getElementById("userTab");	
	userTab.style= "display:block";

	user = JSON.parse(user_info);
	
	userLoggedIn = new User();
	userLoggedIn.create(user.id, user.full_name,user.user_name,user.role, user.email, user.user_groups);
	userLoggedIn.populateUserInterface();
}

function hideLoginPopup()
{
	$('#loginModal').modal('hide');
}

function logout()
{
	var loginButton = document.getElementById("loginButton");	
	loginButton.style= "display:block";
	var userTab = document.getElementById("userTab");	
	userTab.style= "display:none";
	
	userLoggedIn = null;
	
	createHierarchyFile();
}

/* login configuration */

function changeUsersInfo()
{
	hideLoginConfigurationErrorBlock();
	userLoggedIn.populateChangeUserInformationModal();
	
	loginConfigSubmitButton = document.getElementById("loginConfigSubmitButton");
	loginConfigSubmitButton.onclick = function()
	{
		submitChangesInUser();
		//$('#loginConfigurationModal').modal('hide');
	};
}

function submitChangesInUser()
{
	userLoggedIn.submitChanges();
}

function showLoginConfigurationErrorBlock(errorMessage)
{
	var informationErrorAlert = document.getElementById("informationErrorAlert");
	informationErrorAlert.style = "display:block";
	var informationErrorAlertText = document.getElementById("informationErrorAlertText");
	informationErrorAlertText.innerHTML = errorMessage;
}

function hideLoginConfigurationErrorBlock()
{
	var informationErrorAlert = document.getElementById("informationErrorAlert");
	informationErrorAlert.style = "display:none";
}

function createNewUser()
{
	hideLoginConfigurationErrorBlock();
	var loginConfigModalTitle = document.getElementById("loginConfigModalTitle");
	loginConfigModalTitle.innerHTML = "Register";

	var usernameConfig = document.getElementById("usernameConfig");	
	usernameConfig.style = "display:block";
	usernameConfig.value = "";
	var emailConfig = document.getElementById("emailConfig");	
	emailConfig.style = "display:block";
	emailConfig.value = "";
	var fullnameConfig = document.getElementById("fullnameConfig");	
	fullnameConfig.style = "display:block";
	fullnameConfig.value = "";
	var passwordConfig = document.getElementById("passwordConfig");	
	passwordConfig.style = "display:block";
	passwordConfig.value = "";
	var passwordConfirmationConfig = document.getElementById("passwordConfirmationConfig");	
	passwordConfirmationConfig.style = "display:block";
	passwordConfirmationConfig.value = "";
	
	var oldPasswordConfig = document.getElementById("oldPasswordConfig");	
	oldPasswordConfig.style = "display:none";
	
	loginConfigSubmitButton = document.getElementById("loginConfigSubmitButton");
	loginConfigSubmitButton.onclick = function()
	{
		if(passwordConfig.value == passwordConfirmationConfig.value)
		{
			addUser({password:passwordConfig.value, full_name:fullnameConfig.value,user_name:usernameConfig.value, email:emailConfig.value});
			$('#loginConfigurationModal').modal('hide');
		}
		else
		{
			showLoginConfigurationErrorBlock("Passwords do not match. Please try again.");
		}
	};

	$('#loginConfigurationModal').modal('show');
}

function resetUsersPassword()
{
	hideLoginConfigurationErrorBlock();
	var loginConfigModalTitle = document.getElementById("loginConfigModalTitle");
	loginConfigModalTitle.innerHTML = "Password Recovery";

	var usernameConfig = document.getElementById("usernameConfig");	
	usernameConfig.style = "display:block";
	usernameConfig.value = "";
	var emailConfig = document.getElementById("emailConfig");	
	emailConfig.style = "display:block";
	emailConfig.value = "";
	
	var fullnameConfig = document.getElementById("fullnameConfig");	
	fullnameConfig.style = "display:none";
	var passwordConfig = document.getElementById("passwordConfig");	
	passwordConfig.style = "display:none";
	var passwordConfirmationConfig = document.getElementById("passwordConfirmationConfig");	
	passwordConfirmationConfig.style = "display:none";
	var oldPasswordConfig = document.getElementById("oldPasswordConfig");	
	oldPasswordConfig.style = "display:none";
	
	loginConfigSubmitButton = document.getElementById("loginConfigSubmitButton");
	loginConfigSubmitButton.onclick = function()
	{
		resetPassword({user_name:usernameConfig.value, email:emailConfig.value});
		$('#loginConfigurationModal').modal('hide');
	};
	
	$('#loginConfigurationModal').modal('show');
}

/* user */

function User()
{
	this.userName;
	this.fullName;
	this.userID;
	this.role;
	this.email;
	this.groups;
	
	this.create = function(id,full_name,user_name,role,email, groups)
	{
		this.userName = user_name;
		this.fullName = full_name;
		this.userID = id;
		this.role = role;
		this.email = email;
		this.groups = groups;
	}
	
	this.populateUserInterface = function()
	{
		var welcomeUserString = document.getElementById("welcomeUserString");	
		welcomeUserString.innerHTML = "<strong> Welcome, "+this.userName+" </strong>";
		
		var fullnameString = document.getElementById("fullnameString");	
		fullnameString.innerHTML = "<strong> "+this.fullName+" </strong>";
		
		var emailString = document.getElementById("emailString");	
		emailString.innerHTML = this.email;
		
		var userRole;
		if(this.role == "1")
			userRole = "Administrator";
		else
			userRole = "Standard User";
			
		var roleString = document.getElementById("roleString");	
		roleString.innerHTML = userRole;

	}
	
	this.populateChangeUserInformationModal = function()
	{
		
		var usernameConfig = document.getElementById("usernameConfig");	
		usernameConfig.value = this.userName;
		var fullnameConfig = document.getElementById("fullnameConfig");	
		fullnameConfig.value = this.fullName;
		var emailConfig = document.getElementById("emailConfig");	
		emailConfig.value = this.email;
		
		$('#loginConfigurationModal').modal('show');
	}
	
	this.submitChanges = function()
	{
		
		var usernameConfig = document.getElementById("usernameConfig");	
		this.userName = usernameConfig.value;
		var fullnameConfig = document.getElementById("fullnameConfig");	
		this.fullName = fullnameConfig.value;
		var emailConfig = document.getElementById("emailConfig");	
		this.email = emailConfig.value;
		
		var passwordConfig = document.getElementById("passwordConfig");	
		var passwordConfirmationConfig = document.getElementById("passwordConfirmationConfig");	
		
		if(passwordConfig.value == passwordConfirmationConfig.value)
		{
			var oldPasswordConfig = document.getElementById("oldPasswordConfig");	
				
			var usr = {id:this.userID, password:oldPasswordConfig.value, new_password: passwordConfig.value,full_name:this.fullName,user_name:this.userName,role:this.role, email:this.email};
			editUser(usr);

		}
		else
		{
			showLoginConfigurationErrorBlock("Passwords do not match. Please try again.");
		}

	}
	
	this.getID = function()
	{
		return this.userID;
	}
	
	this.getRole = function()
	{
		return this.role;
	}
	
	this.getUserGroupsAsOptionList = function()
	{
		var new_list = [
		{
			name:"private (you and administrators)", 
			id: "none",
			group: ACCESS_OPTION_NAME,
			isNum:false
		},
		{
			name:"public (everyone)",
			id: "none",
			group: ACCESS_OPTION_NAME,
			isNum:false
		}];
		
		for( var key in this.groups)
		{
			new_list.push({name: this.groups[key],id: "none", group: ACCESS_OPTION_NAME, isNum: false});
		}
		
		return new_list;
	}
	
	this.getIndexByGroupName = function(name)
	{
		for( var key in this.groups)
		{
			if(this.groups[key] == name)
			{
				return key;
			}
		}
	}
	
	
}
