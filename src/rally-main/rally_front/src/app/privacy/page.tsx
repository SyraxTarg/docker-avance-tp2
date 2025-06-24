"use client";

import React from "react";

export default function PrivacyPolicyPage () {
    return (
        <main className="max-w-4xl mx-auto py-12 px-6 text-gray-800 pt-18">
            <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                <p>
                    Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre site.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">2. Données collectées</h2>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Informations fournies lors de l&apos;inscription (nom, prénom, adresse e-mail, mot de passe)</li>
                    <li>Adresses IP, y compris pour les utilisateurs non connectés</li>
                    <li>Informations de connexion et d&apos;activité sur le site</li>
                    <li>Historique des paiements et inscriptions aux événements</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">3. Utilisation des données</h2>
                <p>Les données sont utilisées pour :</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Fournir et améliorer nos services</li>
                    <li>Assurer la sécurité de la plateforme (ex : détection de tentatives de connexion malveillantes)</li>
                    <li>Prévenir la fraude et les abus</li>
                    <li>Permettre les paiements et inscriptions entre utilisateurs</li>
                </ul>
                <p className="mt-2">
                    Les utilisateurs connectés consentent à ce que leur adresse e-mail soit partagée avec d&apos;autres utilisateurs dans le cadre des fonctionnalités de paiement et d&apos;inscription aux événements.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">4. Base légale du traitement</h2>
                <p>
                    Le traitement de vos données repose sur :
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Votre consentement</li>
                    <li>L&apos;exécution d&apos;un contrat (par exemple, gestion des événements)</li>
                    <li>Notre intérêt légitime à sécuriser notre service et à prévenir les abus</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">5. Durée de conservation</h2>
                <p>
                    Les données sont conservées uniquement le temps nécessaire à leur finalité. Les adresses IP liées à la sécurité sont conservées temporairement, puis supprimées ou anonymisées.
                </p>
                <p className="mt-2">
                    Les adresses e-mail des utilisateurs bannis sont conservées pendant une durée maximale de 12 mois après la date de bannissement, afin de prévenir toute tentative de réinscription frauduleuse. Elles sont ensuite supprimées.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">6. Vos droits</h2>
                <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Droit d&apos;accès</li>
                    <li>Droit de rectification</li>
                    <li>Droit à l&apos;effacement</li>
                    <li>Droit d&apos;opposition</li>
                    <li>Droit à la portabilité</li>
                </ul>
                <p className="mt-2">
                    Pour exercer vos droits, vous pouvez nous contacter à l&apos;adresse suivante : <strong>policy@rally.com</strong>
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">7. Sécurité des données</h2>
                <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l&apos;accès non autorisé, la divulgation ou l&apos;altération.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
                <p>
                    Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à <strong>policy@rally.com</strong>.
                </p>
            </section>
        </main>
    );
};
