const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
});

const deployBtn = document.querySelector('.deploy-btn');
const modal = document.querySelector('#deploy-modal');
const closeModal = document.querySelector('.close');
const progress = document.querySelector('.progress');
const successMessage = document.querySelector('.success-message');
const templateName = document.querySelector('#template-name');

const templateButtons = document.querySelectorAll('.template-btn');
const templateTitle = document.querySelector('#template-title');
const templateServicesCount = document.querySelector('#template-services-count');
const servicesList = document.querySelector('#services-list');
const templatePreview = document.querySelector('.template-preview');
let selectedTemplate = 'Node.js';

// Définir les templates et leurs services associés
const templates = {
    'Node.js': {
        title: 'Node.js Starter',
        servicesCount: 3,
        services: [
            {
                name: 'Primary',
                repo: 'scalingo/nodejs',
                status: 'Trying to access GitHub repository',
                configureLink: 'https://scalingo.com/configure/nodejs-primary'
            },
            {
                name: 'Worker',
                repo: 'scalingo/nodejs-worker',
                status: 'Trying to access GitHub repository',
                configureLink: 'https://scalingo.com/configure/nodejs-worker'
            },
            {
                name: 'Redis',
                repo: 'bitnami/redis',
                status: 'Trying to access GitHub repository',
                configureLink: 'https://scalingo.com/configure/redis'
            }
        ]
    },
    'Python': {
        title: 'Python Flask Starter',
        servicesCount: 2,
        services: [
            {
                name: 'Primary',
                repo: 'scalingo/flask',
                status: 'Trying to access GitHub repository',
                configureLink: 'https://scalingo.com/configure/flask-primary'
            },
            {
                name: 'PostgreSQL',
                repo: 'scalingo/postgres',
                status: 'Trying to access GitHub repository',
                configureLink: 'https://scalingo.com/configure/postgres'
            }
        ]
    },
    'Rails': {
        title: 'Ruby on Rails Starter',
        servicesCount: 3,
        services: [
            {
                name: 'Primary',
                repo: 'scalingo/rails',
                status: 'Trying to access GitHub repository',
                configureLink: 'https://scalingo.com/configure/rails-primary'
            },
            {
                name: 'Worker',
                repo: 'scalingo/rails-worker',
                status: 'Trying to access GitHub repository',
                configureLink: 'https://scalingo.com/configure/rails-worker'
            },
            {
                name: 'PostgreSQL',
                repo: 'scalingo/postgres',
                status: 'Trying to access GitHub repository',
                configureLink: 'https://scalingo.com/configure/postgres'
            }
        ]
    }
};

// Mettre à jour l'aperçu du template
function updateTemplatePreview() {
    templatePreview.classList.remove('visible');
    setTimeout(() => {
        // Mettre à jour le titre et le nombre de services
        templateTitle.textContent = templates[selectedTemplate].title;
        templateServicesCount.textContent = `This template deploys ${templates[selectedTemplate].servicesCount} services.`;

        // Vider la liste des services
        servicesList.innerHTML = '';

        // Ajouter les services dynamiquement
        templates[selectedTemplate].services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.classList.add('service-item');
            serviceItem.innerHTML = `
                <div class="service-info">
                    <div class="icon">⚙️</div>
                    <div class="details">
                        <h4>${service.name}</h4>
                        <p class="repo">${service.repo}</p>
                        <p>${service.status}</p>
                    </div>
                </div>
                <a href="${service.configureLink}" class="configure-btn">Configure</a>
            `;
            servicesList.appendChild(serviceItem);
        });

        templatePreview.classList.add('visible');
    }, 300); // Délai pour l'animation de transition
}

templateButtons.forEach(button => {
    button.addEventListener('click', () => {
        templateButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedTemplate = button.getAttribute('data-template');
        templateName.textContent = selectedTemplate;
        updateTemplatePreview();
    });
});

deployBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    progress.style.width = '0';
    successMessage.style.display = 'none';
    setTimeout(() => {
        progress.style.width = '100%';
    }, 100);
    setTimeout(() => {
        successMessage.style.display = 'block';
    }, 2000);
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Animation des statistiques avec easing
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let count = 0;
        const duration = 3000; // Durée totale de l'animation en ms (3 secondes)
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Progression de 0 à 1

            // Utiliser une fonction d'easing (ease-out) pour ralentir vers la fin
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
            count = easedProgress * target;

            if (progress < 1) {
                stat.textContent = Math.floor(count).toLocaleString('fr-FR'); // Formatage avec espaces (ex. 1 027 767)
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target.toLocaleString('fr-FR'); // Valeur finale exacte
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// Animation progressive des éléments .stat-item
function animateStatItems() {
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 200); // Décalage de 200ms entre chaque élément
    });
}

const elementsToReveal = document.querySelectorAll('.hero-content, .client-logos, .mockup, .mockup-small, .mockup-preview, .one-click-deploy, .mockup-deploy, .why-scalingo, .stats-section, .metrics-table');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Lancer l'animation des stats et des éléments .stat-item uniquement pour la section .stats-section
            if (entry.target.classList.contains('stats-section')) {
                animateStats();
                animateStatItems();
            }
        }
    });
}, { threshold: 0.1 });

elementsToReveal.forEach(element => observer.observe(element));

// Initialiser l'aperçu du template au chargement
updateTemplatePreview();
