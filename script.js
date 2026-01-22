// ===== Expense Manager Application =====

// Application state and data management
const ExpenseManager = {
    // Initialize the application
    init: function() {
        console.log("Expense Manager Initializing...");
        
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Set today's date as default in the form
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        document.getElementById('edit-date').value = today;
        
        // Load expenses from localStorage
        this.loadExpenses();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Render the dashboard (default page)
        this.renderDashboard();
        
        console.log("Expense Manager Ready!");
    },
    
    // Expenses data structure
    expenses: [],
    
    // Categories with colors for charts
    categories: {
        'Food': { color: '#4cc9f0', bgColor: 'rgba(76, 201, 240, 0.2)' },
        'Transportation': { color: '#f8961e', bgColor: 'rgba(248, 150, 30, 0.2)' },
        'Rent': { color: '#f72585', bgColor: 'rgba(247, 37, 133, 0.2)' },
        'Utilities': { color: '#7209b7', bgColor: 'rgba(114, 9, 183, 0.2)' },
        'Entertainment': { color: '#4361ee', bgColor: 'rgba(67, 97, 238, 0.2)' },
        'Other': { color: '#6c757d', bgColor: 'rgba(108, 117, 125, 0.2)' }
    },
    
    // Load expenses from localStorage
    loadExpenses: function() {
        const savedExpenses = localStorage.getItem('expenseManagerExpenses');
        if (savedExpenses) {
            this.expenses = JSON.parse(savedExpenses);
            console.log(`Loaded ${this.expenses.length} expenses from localStorage`);
        } else {
            this.expenses = [];
            console.log('No expenses found in localStorage, starting with empty array');
        }
    },
    
    // Save expenses to localStorage
    saveExpenses: function() {
        localStorage.setItem('expenseManagerExpenses', JSON.stringify(this.expenses));
        console.log(`Saved ${this.expenses.length} expenses to localStorage`);
    },
    
    // Set up all event listeners
    setupEventListeners: function() {
        // Navigation
        this.setupNavigation();
        
        // Expense form
        this.setupExpenseForm();
        
        // Edit form
        this.setupEditForm();
        
        // Delete functionality
        this.setupDeleteFunctionality();
        
        // Modal close buttons
        this.setupModalClose();
    },
    
    // Navigation between pages
    setupNavigation: function() {
        const navLinks = document.querySelectorAll('.nav-link');
        const viewAllLink = document.querySelector('.view-all');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links and pages
                navLinks.forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Show the corresponding page
                const pageId = link.getAttribute('data-page');
                const targetPage = document.getElementById(`${pageId}-page`);
                if (targetPage) {
                    targetPage.classList.add('active');
                    
                    // Render content for the page
                    if (pageId === 'dashboard') {
                        this.renderDashboard();
                    } else if (pageId === 'expenses') {
                        this.renderExpensesTable();
                    }
                }
            });
        });
        
        // View all link in recent expenses
        if (viewAllLink) {
            viewAllLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Switch to expenses page
                navLinks.forEach(l => l.classList.remove('active'));
                document.querySelector('[data-page="expenses"]').classList.add('active');
                
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                document.getElementById('expenses-page').classList.add('active');
                
                this.renderExpensesTable();
            });
        }
    },
    
    // Expense form submission
    setupExpenseForm: function() {
        const form = document.getElementById('expense-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (this.validateExpenseForm()) {
                // Get form values
                const amount = parseFloat(document.getElementById('amount').value);
                const category = document.getElementById('category').value;
                const date = document.getElementById('date').value;
                const description = document.getElementById('description').value.trim();
                
                // Create expense object with unique ID
                const expense = {
                    id: Date.now(), // Simple ID generation using timestamp
                    amount: amount,
                    category: category,
                    date: date,
                    description: description || `Expense on ${date}`
                };
                
                // Add to expenses array
                this.expenses.push(expense);
                
                // Save to localStorage
                this.saveExpenses();
                
                // Reset form
                form.reset();
                document.getElementById('date').value = new Date().toISOString().split('T')[0];
                
                // Show success message (in a real app, you might use a toast notification)
                alert('Expense added successfully!');
                
                // Switch to dashboard and update it
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                document.querySelector('[data-page="dashboard"]').classList.add('active');
                
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                document.getElementById('dashboard-page').classList.add('active');
                
                this.renderDashboard();
            }
        });
    },
    
    // Edit form functionality
    setupEditForm: function() {
        const form = document.getElementById('edit-expense-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (this.validateEditForm()) {
                // Get form values
                const id = parseInt(document.getElementById('edit-id').value);
                const amount = parseFloat(document.getElementById('edit-amount').value);
                const category = document.getElementById('edit-category').value;
                const date = document.getElementById('edit-date').value;
                const description = document.getElementById('edit-description').value.trim();
                
                // Find the expense index
                const expenseIndex = this.expenses.findIndex(expense => expense.id === id);
                
                if (expenseIndex !== -1) {
                    // Update the expense
                    this.expenses[expenseIndex] = {
                        ...this.expenses[expenseIndex],
                        amount: amount,
                        category: category,
                        date: date,
                        description: description || `Expense on ${date}`
                    };
                    
                    // Save to localStorage
                    this.saveExpenses();
                    
                    // Close modal
                    this.closeModal('edit-modal');
                    
                    // Update the UI
                    this.renderDashboard();
                    this.renderExpensesTable();
                    
                    // Show success message
                    alert('Expense updated successfully!');
                }
            }
        });
    },
    
    // Delete expense functionality
    setupDeleteFunctionality,
    // ===== Expense Manager Application - Continued =====

// Continuing from the previous code...

// Delete expense functionality
setupDeleteFunctionality: function() {
    let expenseToDelete = null;
    
    // Listen for delete button clicks in the table
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete')) {
            e.preventDefault();
            const expenseId = parseInt(e.target.closest('.btn-delete').getAttribute('data-id'));
            expenseToDelete = this.expenses.find(expense => expense.id === expenseId);
            
            if (expenseToDelete) {
                // Show delete confirmation modal
                document.getElementById('delete-details').textContent = 
                    `${expenseToDelete.description} - $${expenseToDelete.amount.toFixed(2)}`;
                this.openModal('delete-modal');
            }
        }
    });
    
    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (expenseToDelete) {
                // Remove expense from array
                this.expenses = this.expenses.filter(expense => expense.id !== expenseToDelete.id);
                
                // Save to localStorage
                this.saveExpenses();
                
                // Close modal
                this.closeModal('delete-modal');
                
                // Reset variable
                expenseToDelete = null;
                
                // Update the UI
                this.renderDashboard();
                this.renderExpensesTable();
                
                // Show success message
                alert('Expense deleted successfully!');
            }
        });
    }
},

// Setup modal close functionality
setupModalClose: function() {
    // Close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.closest('.modal').id;
            this.closeModal(modalId);
        });
    });
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal.id);
            }
        });
    });
},

// Open a modal by ID
openModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
},

// Close a modal by ID
closeModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
},

// Validate expense form
validateExpenseForm: function() {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('#expense-form .error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Validate amount
    const amountInput = document.getElementById('amount');
    const amountValue = parseFloat(amountInput.value);
    if (!amountValue || amountValue <= 0) {
        document.getElementById('amount-error').textContent = 'Please enter a valid amount greater than 0';
        isValid = false;
    }
    
    // Validate category
    const categoryInput = document.getElementById('category');
    if (!categoryInput.value) {
        document.getElementById('category-error').textContent = 'Please select a category';
        isValid = false;
    }
    
    // Validate date
    const dateInput = document.getElementById('date');
    if (!dateInput.value) {
        document.getElementById('date-error').textContent = 'Please select a date';
        isValid = false;
    }
    
    return isValid;
},

// Validate edit form
validateEditForm: function() {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('#edit-expense-form .error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Validate amount
    const amountInput = document.getElementById('edit-amount');
    const amountValue = parseFloat(amountInput.value);
    if (!amountValue || amountValue <= 0) {
        document.getElementById('edit-amount-error').textContent = 'Please enter a valid amount greater than 0';
        isValid = false;
    }
    
    // Validate category
    const categoryInput = document.getElementById('edit-category');
    if (!categoryInput.value) {
        document.getElementById('edit-category-error').textContent = 'Please select a category';
        isValid = false;
    }
    
    // Validate date
    const dateInput = document.getElementById('edit-date');
    if (!dateInput.value) {
        document.getElementById('edit-date-error').textContent = 'Please select a date';
        isValid = false;
    }
    
    return isValid;
},

// Render dashboard with all charts and summaries
renderDashboard: function() {
    console.log("Rendering dashboard...");
    
    // Update summary cards
    this.updateSummaryCards();
    
    // Update category chart
    this.renderCategoryChart();
    
    // Update monthly chart
    this.renderMonthlyChart();
    
    // Update recent expenses table
    this.renderRecentExpenses();
},

// Update summary cards with calculations
updateSummaryCards: function() {
    const totalExpenses = this.calculateTotalExpenses();
    const monthlyExpenses = this.calculateMonthlyExpenses();
    const dailyAverage = this.calculateDailyAverage();
    
    // Update DOM elements
    document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('monthly-expenses').textContent = `$${monthlyExpenses.toFixed(2)}`;
    document.getElementById('daily-average').textContent = `$${dailyAverage.toFixed(2)}`;
},

// Calculate total of all expenses
calculateTotalExpenses: function() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
},

// Calculate total expenses for current month
calculateMonthlyExpenses: function() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return this.expenses.reduce((total, expense) => {
        const expenseDate = new Date(expense.date);
        if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
            return total + expense.amount;
        }
        return total;
    }, 0);
},

// Calculate daily average for current month
calculateDailyAverage: function() {
    const monthlyExpenses = this.calculateMonthlyExpenses();
    const now = new Date();
    const currentDay = now.getDate();
    
    // Avoid division by zero
    if (currentDay === 0) return 0;
    
    return monthlyExpenses / currentDay;
},

// Render category chart
renderCategoryChart: function() {
    const chartContainer = document.getElementById('category-chart');
    
    // Clear previous chart
    chartContainer.innerHTML = '';
    
    // If no expenses, show message
    if (this.expenses.length === 0) {
        chartContainer.innerHTML = '<div class="no-data">No expense data yet. Add your first expense!</div>';
        return;
    }
    
    // Calculate totals by category
    const categoryTotals = {};
    Object.keys(this.categories).forEach(category => {
        categoryTotals[category] = 0;
    });
    
    this.expenses.forEach(expense => {
        if (categoryTotals.hasOwnProperty(expense.category)) {
            categoryTotals[expense.category] += expense.amount;
        } else {
            categoryTotals[expense.category] = expense.amount;
        }
    });
    
    // Find the maximum value for scaling
    const maxValue = Math.max(...Object.values(categoryTotals));
    
    // Create bars for each category
    Object.entries(categoryTotals).forEach(([category, total]) => {
        if (total > 0) {
            // Calculate bar height (as percentage of max value)
            const barHeight = maxValue > 0 ? (total / maxValue) * 100 : 0;
            
            // Create bar element
            const barElement = document.createElement('div');
            barElement.className = 'category-bar';
            
            // Create the actual bar
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${barHeight}%`;
            bar.style.backgroundColor = this.categories[category].color;
            
            // Create value label
            const valueLabel = document.createElement('div');
            valueLabel.className = 'bar-value';
            valueLabel.textContent = `$${total.toFixed(2)}`;
            
            // Create category label
            const categoryLabel = document.createElement('div');
            categoryLabel.className = 'bar-label';
            categoryLabel.textContent = category;
            
            // Assemble the bar
            bar.appendChild(valueLabel);
            barElement.appendChild(bar);
            barElement.appendChild(categoryLabel);
            
            // Add to chart
            chartContainer.appendChild(barElement);
        }
    });
},

// Render monthly chart (last 6 months)
renderMonthlyChart: function() {
    const chartContainer = document.getElementById('monthly-chart');
    
    // Clear previous chart
    chartContainer.innerHTML = '';
    
    // If no expenses, show message
    if (this.expenses.length === 0) {
        chartContainer.innerHTML = '<div class="no-data">No expense data yet. Add your first expense!</div>';
        return;
    }
    
    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Calculate totals for last 6 months
    const monthlyTotals = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        let month = currentMonth - i;
        let year = currentYear;
        
        // Handle year wrap-around
        if (month < 0) {
            month += 12;
            year -= 1;
        }
        
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
        const monthLabel = `${monthNames[month]} ${year.toString().slice(2)}`;
        monthlyTotals[monthKey] = { total: 0, label: monthLabel };
    }
    
    // Calculate expenses for each month
    this.expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const expenseYear = expenseDate.getFullYear();
        const expenseMonth = expenseDate.getMonth();
        const monthKey = `${expenseYear}-${expenseMonth.toString().padStart(2, '0')}`;
        
        if (monthlyTotals.hasOwnProperty(monthKey)) {
            monthlyTotals[monthKey].total += expense.amount;
        }
    });
    
    // Find the maximum value for scaling
    const maxValue = Math.max(...Object.values(monthlyTotals).map(m => m.total));
    
    // Create bars for each month
    Object.entries(monthlyTotals).forEach(([monthKey, monthData]) => {
        // Calculate bar height (as percentage of max value)
        const barHeight = maxValue > 0 ? (monthData.total / maxValue) * 100 : 0;
        
        // Create bar element
        const barElement = document.createElement('div');
        barElement.className = 'month-bar';
        
        // Create the actual bar
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${barHeight}%`;
        bar.style.backgroundColor = '#4361ee'; // Use primary color for monthly chart
        
        // Create value label
        const valueLabel = document.createElement('div');
        valueLabel.className = 'bar-value';
        valueLabel.textContent = monthData.total > 0 ? `$${monthData.total.toFixed(2)}` : '';
        
        // Create month label
        const monthLabel = document.createElement('div');
        monthLabel.className = 'bar-label';
        monthLabel.textContent = monthData.label;
        
        // Assemble the bar
        bar.appendChild(valueLabel);
        barElement.appendChild(bar);
        barElement.appendChild(monthLabel);
        
        // Add to chart
        chartContainer.appendChild(barElement);
    });
},

// Render recent expenses table (last 5 expenses)
renderRecentExpenses: function() {
    const tableBody = document.getElementById('recent-expenses-table');
    
    // Clear table
    tableBody.innerHTML = '';
    
    // If no expenses, show message
    if (this.expenses.length === 0) {
        const row = document.createElement('tr');
        row.className = 'no-data-row';
        row.innerHTML = '<td colspan="4">No expenses yet. Add your first expense!</td>';
        tableBody.appendChild(row);
        return;
    }
    
    // Sort expenses by date (newest first) and get first 5
    const recentExpenses = [...this.expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    // Create table rows
    recentExpenses.forEach(expense => {
        const row = document.createElement('tr');
        
        // Format date
        const dateObj = new Date(expense.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Create category badge
        const categoryClass = `category-${expense.category.toLowerCase()}`;
        
        row.innerHTML = `
            <td>${expense.description}</td>
            <td><span class="category-badge ${categoryClass}">${expense.category}</span></td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${formattedDate}</td>
        `;
        
        tableBody.appendChild(row);
    });
},

// Render all expenses table
renderExpensesTable: function() {
    const tableBody = document.getElementById('all-expenses-table');
    
    // Clear table
    tableBody.innerHTML = '';
    
    // If no expenses, show message
    if (this.expenses.length === 0) {
        const row = document.createElement('tr');
        row.className = 'no-data-row';
        row.innerHTML = '<td colspan="5">No expenses yet. Add your first expense!</td>';
        tableBody.appendChild(row);
        return;
    }
    
    // Sort expenses by date (newest first)
    const sortedExpenses = [...this.expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create table rows
    sortedExpenses.forEach(expense => {
        const row = document.createElement('tr');
        
        // Format date
        const dateObj = new Date(expense.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Create category badge
        const categoryClass = `category-${expense.category.toLowerCase()}`;
        
        row.innerHTML = `
            <td>${expense.description}</td>
            <td><span class="category-badge ${categoryClass}">${expense.category}</span></td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" data-id="${expense.id}" title="Edit expense">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" data-id="${expense.id}" title="Delete expense">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to edit buttons
    this.setupEditButtons();
},

// Setup edit buttons in the expenses table
setupEditButtons: function() {
    const editButtons = document.querySelectorAll('.btn-edit');
    
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const expenseId = parseInt(button.getAttribute('data-id'));
            const expense = this.expenses.find(expense => expense.id === expenseId);
            
            if (expense) {
                // Populate edit form with expense data
                document.getElementById('edit-id').value = expense.id;
                document.getElementById('edit-amount').value = expense.amount;
                document.getElementById('edit-category').value = expense.category;
                document.getElementById('edit-date').value = expense.date;
                document.getElementById('edit-description').value = expense.description;
                
                // Open edit modal
                this.openModal('edit-modal');
            }
        });
    });
},

// Initialize sample data (for demonstration)
initializeSampleData: function() {
    // Only add sample data if no expenses exist
    if (this.expenses.length === 0) {
        console.log("Initializing sample data...");
        
        const sampleExpenses = [
            {
                id: 1,
                amount: 45.75,
                category: 'Food',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: 'Lunch at restaurant'
            },
            {
                id: 2,
                amount: 120.50,
                category: 'Transportation',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: 'Monthly metro card'
            },
            {
                id: 3,
                amount: 850.00,
                category: 'Rent',
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: 'Apartment rent'
            },
            {
                id: 4,
                amount: 65.30,
                category: 'Utilities',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: 'Electricity bill'
            },
            {
                id: 5,
                amount: 29.99,
                category: 'Entertainment',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                description: 'Movie tickets'
            },
            {
                id: 6,
                amount: 15.00,
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                description: 'Coffee shop'
            }
        ];
        
        this.expenses = sampleExpenses;
        this.saveExpenses();
        this.renderDashboard();
        this.renderExpensesTable();
        
        alert('Sample data loaded! You can now explore the Expense Manager features.');
    }
},

// Public method to add sample data (can be called from console for testing)
addSampleData: function() {
    this.initializeSampleData();
}
};

// ===== Initialize the Application =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Expense Manager
    ExpenseManager.init();
    
    // For testing/demo purposes, you can uncomment the line below to load sample data
    // ExpenseManager.initializeSampleData();
    
    // You can also call ExpenseManager.addSampleData() from browser console to add sample data
});

// ===== Helper Functions =====

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Make ExpenseManager available globally for debugging
window.ExpenseManager = ExpenseManager;