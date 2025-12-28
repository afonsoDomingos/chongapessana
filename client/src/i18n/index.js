import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        nav: {
            home: 'Home',
            portfolio: 'Portfolio',
            courses: 'Courses',
            login: 'Login',
            register: 'Register',
            dashboard: 'Dashboard'
        },
        home: {
            title: 'Cinematic Vision',
            subtitle: 'Chonga Pessana - Photographer & Cinematographer',
            cta: 'View My Work'
        },
        courses: {
            title: 'Learning & Mastery',
            enroll: 'Enroll Now',
            pending: 'Payment Pending Validation',
            approved: 'Access Granted',
            rejected: 'Payment Rejected',
            uploadProof: 'Upload Proof of Payment'
        },
        bio: {
            title: 'About the Artist',
            summary: 'Chonga Pessana is an artist cinematographer based in Maputo, Mozambique, known for his cinematic vision and storytelling.',
            full: `Chonga Pessana is an artist cinematographer based in Maputo, Mozambique, and a member of the Mozambican Skate Association (ASM) since 2014. He is actively involved in the development and supervision of activities for children within the association.

His passion for cinema, photography, and the arts began when he took charge of audio-visual content during community events, influenced by his uncle, Isard Mané Pintula, a professional in audio-visual production.

In 2015, Chonga attended a photography mini-course organized by Mozarte, where he met Caroline Ljungström, who became his mentor and greatly influenced his approach to photography. He later directed the "Photographs that Tell Stories" mini-course in 2016, collaborated with Ana Raquel, and developed his first successful project, "Tsama-lá," focusing on the recycling of materials for chair production in urban areas.

Throughout 2017, Chonga collaborated on various projects, including the restoration of urban spaces for children and a collective exhibition curated by João Roxo and Tavares Cebola. He also worked with artist Nemézio Zuber on a digital photography exhibition and participated in the 10th edition of KINANI in 2023, aiming to promote artistic expression and provide visibility to diverse approaches in an open environment.

Chonga's dedication to photography and the arts has led to numerous successful projects and collaborations, demonstrating his commitment to creative expression and community involvement.`,
            readMore: 'Full Biography',
            close: 'Close'
        },
        contact: {
            title: 'Get in Touch',
            email: 'Email',
            phone: 'Chonga',
            agent: 'Agent',
            follow: 'Follow me'
        },
        payment: {
            howTo: 'How to Pay',
            instructions: 'Choose a method below and upload the receipt for immediate access.',
            emola: 'Vodacom E-mola',
            mpesa: 'M-Pesa',
            bim: 'BIM Bank (Millennium BIM)',
            paypal: 'PayPal',
            account: 'Account/NIB',
            owner: 'Owner'
        },
        profile: {
            edit: 'Personalize Profile',
            personal: 'Personal Data',
            name: 'Full Name',
            email: 'Email Address',
            newPassword: 'New Password',
            save: 'Save Changes'
        }
    },
    pt: {
        nav: {
            home: 'Início',
            portfolio: 'Portfólio',
            courses: 'Cursos',
            login: 'Entrar',
            register: 'Registar',
            dashboard: 'Painel'
        },
        home: {
            title: 'Visão Cinematográfica',
            subtitle: 'Chonga Pessana - Fotógrafo e Cineasta',
            cta: 'Ver Meu Trabalho'
        },
        courses: {
            title: 'Aprendizagem & Maestria',
            enroll: 'Inscrever-se',
            pending: 'Pagamento Aguardando Validação',
            approved: 'Acesso Liberado',
            rejected: 'Pagamento Rejeitado',
            uploadProof: 'Fazer Upload do Comprovativo'
        },
        bio: {
            title: 'Sobre o Artista',
            summary: 'Chonga Pessana é um cineasta e artista baseado em Maputo, Moçambique, reconhecido pela sua visão cinematográfica e narrativa visual.',
            full: `Chonga Pessana é um cineasta e artista baseado em Maputo, Moçambique, e membro da Associação Moçambicana de Skate (ASM) desde 2014. Ele está ativamente envolvido no desenvolvimento e supervisão de atividades para crianças dentro da associação.

A sua paixão pelo cinema, fotografia e artes começou quando assumiu a responsabilidade pelo conteúdo audiovisual durante eventos comunitários, influenciado pelo seu tio, Isard Mané Pintula, profissional em produção audiovisual.

Em 2015, Chonga frequentou um mini-curso de fotografia organizado pela Mozarte, onde conheceu Caroline Ljungström, que se tornou sua mentora e influenciou grandemente a sua abordagem à fotografia. Posteriormente, dirigiu o mini-curso "Fotografias que Contam Histórias" em 2016, colaborou com Ana Raquel, e desenvolveu o seu primeiro projeto de sucesso, "Tsama-lá", focado na reciclagem de materiais para produção de cadeiras em áreas urbanas.

Ao longo de 2017, Chonga colaborou em diversos projetos, incluindo a restauração de espaços urbanos para crianças e uma exposição colectiva com curadoria de João Roxo e Tavares Cebola. Também trabalhou com o artista Nemézio Zuber numa exposição de fotografia digital e participou na 10ª edição do KINANI em 2023, com o objectivo de promover a expressão artística e dar visibilidade a diversas abordagens num ambiente aberto.

A dedicação de Chonga à fotografia e às artes levou a inúmeros projetos e colaborações de sucesso, demonstrando o seu compromisso com a expressão criativa e o envolvimento comunitário.`,
            readMore: 'Biografia Completa',
            close: 'Fechar'
        },
        contact: {
            title: 'Contacto',
            email: 'Email',
            phone: 'Chonga',
            agent: 'Agente',
            follow: 'Siga-me'
        },
        payment: {
            howTo: 'Como Pagar',
            instructions: 'Escolha um dos métodos abaixo e envie o comprovativo para acesso imediato.',
            emola: 'Vodacom E-mola',
            mpesa: 'M-Pesa',
            bim: 'NIB BIM (Millennium BIM)',
            paypal: 'PayPal',
            account: 'Conta',
            owner: 'Titular'
        },
        profile: {
            edit: 'Personalizar Perfil',
            personal: 'Dados Pessoais',
            name: 'Nome Completo',
            email: 'Correio Eletrónico',
            newPassword: 'Nova Palavra-passe',
            save: 'Guardar Alterações'
        }
    }
};

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('lang') || 'pt',
    fallbackLocale: 'en',
    messages,
});

export default i18n;
