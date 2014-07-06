{% extends "../layout.swig" %}
{%block title%}
{{ strim.name}} | strims.player.pl
{%endblock%}

{% block angularSongsList %}
$scope.strimName = "{{ strim.name }}"
$scope.activeIndex = 0;
$http({
    url: "/song/list/{{ strim.id }}",
    dataType: "json",
    method: "GET",
    headers: {
    "Content-Type": "application/json; charset=utf-8"
}
{% endblock %}
