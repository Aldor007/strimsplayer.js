{% extends "layout.swig" %}

{% block title%}
Dodaj strim | strimsplayer.pl
{% endblock %}
{% block content %}
    <div class="container page-header" ng-controller="FormCtrl">
        <form name="strimForm" ng-submit="submitForm(strimForm.$valid)" role="form">

            <!-- NAME -->
            <div class="form-group">
            <label>Nazwa strimu</label>
            <input type="text" name="name" class="form-control" ng-model="name" ng-class="{ 'has-error' : strimForm.name.$invalid && !strimForm.name.$pristine }"  placeholder="Nazwa strimu" required
                   ng-pattern="/\w+/" >
            </div>
             <input type="hidden" name="_csrf" value=""{{ _csrf }}"">



            <!-- SUBMIT BUTTON -->
            <button type="submit" class="btn btn-default">Dodaj</button>
        </form>
    </div>
{%endblock%}
